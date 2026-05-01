require "json"

Jekyll::Hooks.register [:posts, :pages], :post_render do |doc|
  next unless doc.output&.include?("<img")

  manifest_path = doc.site.in_source_dir("_data", "responsive_images.json")
  next unless File.exist?(manifest_path)

  manifest = JSON.parse(File.read(manifest_path))
  next if manifest.empty?

  skipped_sources = ["/assets/img/logo.2.png", "/assets/img/CC.png"]
  first_content_image = true

  doc.output = doc.output.gsub(/<img\b([^>]*?)>/i) do |tag|
    attrs = Regexp.last_match(1)
    src = attrs[/\bsrc=["']([^"']+)["']/i, 1]
    next tag unless src

    src_path = src.sub(%r{^#{Regexp.escape(doc.site.baseurl.to_s)}}, "")
    next tag if skipped_sources.include?(src_path)

    image = manifest[src_path]
    next tag unless image && image["webp"] && image["webp"].any?

    alt = attrs[/\balt=["']([^"']*)["']/i, 1] || ""
    loading = first_content_image ? "eager" : "lazy"
    priority = first_content_image ? "high" : "auto"
    first_content_image = false
    srcset = image["webp"].map { |variant| "#{variant["src"]} #{variant["width"]}w" }.join(", ")

    "<picture><source type=\"image/webp\" srcset=\"#{srcset}\" sizes=\"(max-width: 640px) calc(100vw - 32px), 600px\"><img src=\"#{src}\" alt=\"#{alt}\" width=\"#{image["width"]}\" height=\"#{image["height"]}\" loading=\"#{loading}\" decoding=\"async\" fetchpriority=\"#{priority}\"></picture>"
  end
end
