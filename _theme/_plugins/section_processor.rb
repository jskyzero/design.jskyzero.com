# ============================================================
# Jekyll 插件：正文分节处理（标题编号、章节卡片、TOC、PRO 徽章）
#
# 在文档渲染完成后（post_render 钩子），用 Nokogiri 对已渲染的
# HTML 做可靠的 DOM 操作，替代原先在 Liquid 里对 HTML 做字符串
# 切分（split/sentinel）的脆弱实现。
#
# 功能：
#   - 为 h2-h5 标题添加层级编号，并用 span 包裹标题内容；
#   - 将每个 h2-h6 标题及其后续内容包裹为 <section class="content-section">；
#   - 在第一个 h1 之后插入内联目录（#toc-inline）与 PRO 徽章；
#   - 将目录填充到右侧侧栏（#toc-sidebar .toc-nav）。
#
# 仅处理 layout 为 post 或 page 的文档，正文边界以第一个
# .git-log-window（文章末尾的 Git 修订区块）为界。
# ============================================================

require 'nokogiri'
require 'cgi'

module Jekyll
  module SectionProcessor
    HEADING_RE = /\Ah[1-6]\z/

    Jekyll::Hooks.register [:posts, :pages], :post_render do |doc|
      begin
        doc.output = process(doc) || doc.output
      rescue StandardError => e
        Jekyll.logger.warn "SectionProcessor:", "处理 #{doc.relative_path} 失败，已跳过: #{e.message}"
      end
    end

    def self.process(doc)
      layout = doc.data['layout'].to_s
      return nil unless %w[post page].include?(layout)

      output = doc.output
      return nil unless output && output.include?('<h')

      html = Nokogiri::HTML5(output)
      main = html.at_css('main.site-main')
      return nil unless main

      body_nodes, = split_body(main)
      return nil unless body_nodes.any? { |n| heading?(n) }

      is_post = layout == 'post'

      # 第一遍：编号 + 包裹 + 收集目录
      toc = []
      counters = Hash.new(0)
      body_nodes.each do |node|
        next unless heading?(node)
        level = node.name[1].to_i
        text = node.text.strip
        id = node['id']
        update_counters!(counters, level)
        wrap_heading(node, heading_number(level, counters))
        toc << { level: level, id: id, text: text } if level.between?(1, 4)
      end

      # 第二遍：分节 + 插入内联目录与 PRO 徽章
      fragment = build_sections(body_nodes, toc, is_post, doc)

      # 将重建后的正文插回 main 开头（位于 .git-log-window 之前）
      first_rest = main.children.first
      fragment.children.to_a.each do |child|
        if first_rest
          first_rest.add_previous_sibling(child)
        else
          main.add_child(child)
        end
      end

      # 填充右侧目录
      toc_html = build_toc(toc)
      nav = html.at_css('#toc-sidebar .toc-nav')
      nav.inner_html = toc_html if nav && !toc_html.empty?

      html.to_html
    end

    # 将 main 的直接子节点按正文/其余拆分：
    # 第一个 .git-log-window（文章末尾的 Git 修订区块）之前为正文。
    def self.split_body(main)
      all = main.children.to_a
      idx = all.index { |n| n.element? && (n['class'] || '').split.include?('git-log-window') }
      idx ? [all[0...idx], all[idx..-1]] : [all, []]
    end

    def self.heading?(node)
      node.element? && node.name =~ HEADING_RE
    end

    def self.update_counters!(counters, level)
      case level
      when 1
        counters[2] = counters[3] = counters[4] = counters[5] = 0
      when 2
        counters[2] += 1
        counters[3] = counters[4] = counters[5] = 0
      when 3
        counters[3] += 1
        counters[4] = counters[5] = 0
      when 4
        counters[4] += 1
        counters[5] = 0
      when 5
        counters[5] += 1
      end
    end

    def self.heading_number(level, counters)
      case level
      when 2 then "#{counters[2]}."
      when 3 then "#{counters[2]}.#{counters[3]}."
      when 4 then "#{counters[2]}.#{counters[3]}.#{counters[4]}."
      when 5 then "#{counters[2]}.#{counters[3]}.#{counters[4]}.#{counters[5]}."
      else ''
      end
    end

    # 用 span 包裹标题内容，插入计数器与斜线装饰
    def self.wrap_heading(node, number)
      label = node.inner_html
      node.inner_html = ''
      unless number.empty?
        node.add_child(Nokogiri::HTML5.fragment(%(<span class="heading-counter">#{number}</span>)))
      end
      node.add_child(Nokogiri::HTML5.fragment(%(<span class="heading-label">#{label}</span>)))
      node.add_child(Nokogiri::HTML5.fragment(%(<span class="svg-heading-rule" aria-hidden="true"></span>)))
    end

    def self.build_sections(body_nodes, toc, is_post, doc)
      fragment = Nokogiri::HTML5.fragment('')
      current = nil
      first_h1 = true
      section_count = 0

      flush = lambda do
        next unless current

        if section_count > 0
          fragment << Nokogiri::HTML5.fragment('<div class="content-section-separator" aria-hidden="true"></div>')
        end
        sec = Nokogiri::HTML5.fragment(
          '<section class="content-section"><div class="content-section-frame" aria-hidden="true"></div></section>'
        )
        el = sec.at_css('section')
        el << current[:heading]
        current[:nodes].each { |n| el << n }
        fragment << el
        section_count += 1
      end

      body_nodes.each do |node|
        if heading?(node)
          level = node.name[1].to_i
          if level == 1
            flush.call
            current = nil
            fragment << node
            if first_h1
              first_h1 = false
              fragment << build_pro(doc) if is_post
              fragment << build_inline_toc(toc)
            end
          else
            flush.call
            current = { heading: node, nodes: [] }
          end
        else
          current ? current[:nodes] << node : fragment << node
        end
      end
      flush.call

      # 全文没有 h1 时，在末尾追加隐藏的内联目录
      fragment << build_inline_toc(toc, hidden: true) if first_h1

      fragment
    end

    def self.build_pro(doc)
      categories = Array(doc.data['categories']).compact
      imgs = categories.map do |c|
        slug = Jekyll::Utils.slugify(c.to_s)
        slug = CGI.escape(c.to_s) if slug.to_s.empty?
        %(<img src="https://img.shields.io/badge/#{slug}-blue.svg?style=flat" alt="#{CGI.escapeHTML(c.to_s)}">)
      end
      date = doc.data['date']
      date_str = date.respond_to?(:strftime) ? date.strftime('%Y/%m/%d') : date.to_s
      imgs << %(<img src="https://img.shields.io/badge/作者-jskyzero-brightgreen.svg?style=flat" alt="作者 jskyzero">)
      imgs << %(<img src="https://img.shields.io/badge/日期-#{date_str}-brightgreen.svg?style=flat" alt="日期 #{date_str}">)
      %(<div class="post-meta-badges" id="pro">#{imgs.join}</div>)
    end

    def self.build_inline_toc(toc, hidden: false)
      inner = build_toc(toc)
      return '' if inner.empty?
      hidden_attr = hidden ? ' hidden' : ''
      %(<div class="inline-outline toc-inline" id="toc-inline"#{hidden_attr}><nav class="toc-nav" aria-label="本文目录">#{inner}</nav></div>)
    end

    # 从标题层级生成嵌套 <ul> 目录
    def self.build_toc(entries)
      return '' if entries.empty?
      out = +''
      stack = []

      entries.each do |e|
        level = e[:level]
        while stack.any? && stack.last > level
          out << '</li></ul>'
          stack.pop
        end
        if stack.empty? || stack.last < level
          out << '<ul><li>'
          stack << level
        else
          out << '</li><li>'
        end
        out << %(<a href="##{e[:id]}">#{CGI.escapeHTML(e[:text])}</a>)
      end
      while stack.any?
        out << '</li></ul>'
        stack.pop
      end
      out
    end
  end
end
