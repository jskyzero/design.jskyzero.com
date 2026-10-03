# 响应式图片：保留原 img 属性，每轮构建只读取一次清单。
require "json"
require "nokogiri"

module Jekyll
  module ResponsiveImages
    def self.manifest(site)
      cached = site.instance_variable_get(:@responsive_images_manifest)
      return cached unless cached.nil?
      file = site.in_source_dir("_data", "responsive_images.json")
      data = File.exist?(file) ? JSON.parse(File.read(file)) : {}
      site.instance_variable_set(:@responsive_images_manifest, data)
    end
  end
end

# serve 重建时清空缓存，让新生成的清单生效。
Jekyll::Hooks.register :site, :after_reset do |site|
  site.instance_variable_set(:@responsive_images_manifest, nil)
end

Jekyll::Hooks.register [:posts, :pages], :post_render do |doc|
  next unless doc.output&.include?("<img")
  manifest = Jekyll::ResponsiveImages.manifest(doc.site)
  next if manifest.empty?
  html = Nokogiri::HTML5(doc.output)
  first_content_image = true
  changed = false
  baseurl = doc.site.baseurl.to_s

  html.css('img').each do |img|
    next if img.ancestors('picture').any?
    src = img['src']
    next unless src
    src_path = src.sub(%r{^#{Regexp.escape(baseurl)}/}, '/')
    next if ["/assets/img/logo.2.png", "/assets/img/CC.png"].include?(src_path)
    image = manifest[src_path]
    next unless image && image["webp"]&.any?

    picture = Nokogiri::XML::Node.new('picture', html)
    source = Nokogiri::XML::Node.new('source', html)
    source['type'] = 'image/webp'
    source['srcset'] = image['webp'].map do |variant|
      "#{baseurl}#{variant['src']} #{variant['width']}w"
    end.join(', ')
    source['sizes'] = img['sizes'] || '(max-width: 640px) calc(100vw - 32px), 600px'
    picture.add_child(source)

    img['width'] ||= image['width'].to_s
    img['height'] ||= image['height'].to_s
    img['loading'] ||= first_content_image ? 'eager' : 'lazy'
    img['decoding'] ||= 'async'
    img['fetchpriority'] ||= first_content_image ? 'high' : 'auto'
    first_content_image = false
    img.replace(picture)
    picture.add_child(img)
    changed = true
  end
  doc.output = html.to_html if changed
end
