# ============================================================
# Jekyll 插件：Git 修订记录生成器
#
# 为每篇文章附加 Git 提交历史到 page.revisions，
# 并生成 revision_summary（创建日期、最后修改、提交次数）。
#
# 启用方式：在 _config.yml 中设置 git_log: true。
# 跳过方式：jekyll build --no-revision。
#
# 参考：
#   https://github.com/aleung/jekyll-post-revision
#   https://github.com/gjtorikian/jekyll-last-modified-at
# ============================================================

require 'open3'

module Jekyll
  module Revision

    # 主生成器 —— 在 Jekyll 构建时运行
    class Generator < Jekyll::Generator
      def generate(site)
        return if site.data['git_log'] == false
        return if ARGV.include?("--no-revision")

        # 仅处理 posts（不处理 pages）
        %w(posts).each do |type|
          site.send(type).docs.each do |item|
            logger = GitLogger.new(site.source, item.path, site.config['revision'])
            item.data['revisions'] = logger.revisions
            item.data['revision_summary'] = logger.summary
          end
        end
        puts("FINISH: post-data-revision")
      end
    end

    # 获取指定文件的 Git 日志
    class GitLogger
      attr_reader :site_source, :page_path, :config

      def initialize(site_source, page_path, config = {})
        @site_source = site_source
        @page_path   = page_path
        @config      = config || {}
      end

      # 返回修订记录数组：[{ date, author, message }, ...]
      # 若条目过多则截断，保留最近记录 + 最早若干条 + 省略标记
      def revisions
        return nil unless is_git_repo?
        truncate(all_revisions)
      end

      # 返回修订摘要：首次创建日期、最后修改日期、总次数
      def summary
        return nil unless is_git_repo?
        revisions = all_revisions
        return nil if revisions.empty?

        {
          "created_at" => revisions.last["date"],
          "updated_at" => revisions.first["date"],
          "count" => revisions.length
        }
      end

      private

      # 最大展示条目数（默认 20）
      def max_count
        config['max_count'] || 20
      end

      # 获取的条目总数（默认 1000），用于生成摘要时统计
      def fetch_count
        config['fetch_count'] || 1000
      end

      # 获取全部修订记录（带缓存）
      def all_revisions
        @all_revisions ||= begin
          logs = Executor.sh('git', 'log', '--follow',
                '--pretty=%ci|%an|%s',
                '--max-count=' + fetch_count.to_s,
                relative_path_from_git_dir)
          logs.lines.map do |line|
            parts = line.split('|')
            {
              "date"    => parts[0].to_s.strip,
              "author"  => parts[1].to_s.strip,
              "message" => parts[2..-1].join('|').strip
            }
          end
        end
      end

      # 截断过长的修订记录：保留最近 N-3 条 + "..." 省略 + 最早 3 条
      def truncate(revisions)
        return revisions if revisions.length <= max_count

        oldest_count = 3
        recent_count = [max_count - oldest_count, 1].max
        revisions.first(recent_count) + [{
          "date"    => nil,
          "author"  => nil,
          "message" => "...",
          "omitted" => true
        }] + revisions.last(oldest_count)
      end

      # 检查当前目录是否位于 Git 仓库中
      def is_git_repo?
        @@is_git_repo ||= begin
          Dir.chdir(site_source) do
            Executor.sh("git", "rev-parse", "--is-inside-work-tree").eql? "true"
          end
        rescue
          false
        end
      end

      # 文章的绝对路径
      def absolute_path_to_article
        @article_file_path ||= Jekyll.sanitized_path(site_source, @page_path)
      end

      # 相对于 Git 根目录的文件路径
      def relative_path_from_git_dir
        @relative_path_from_git_dir ||= Pathname.new(absolute_path_to_article)
          .relative_path_from(
            Pathname.new(File.dirname(top_level_git_directory))
          ).to_s
      end

      # 顶层 .git 目录路径
      def top_level_git_directory
        @@top_level_git_directory ||= begin
          Dir.chdir(site_source) do
            File.join(Executor.sh("git", "rev-parse", "--show-toplevel"), ".git")
          end
        rescue
          ""
        end
      end
    end

    # Shell 命令执行器
    module Executor
      def self.sh(*args)
        Open3.popen2e(*args) do |stdin, stdout_stderr, wait_thr|
          output = stdout_stderr.read
          output ? output.strip : nil
        end
      end
    end

  end
end
