# Run with: bundle exec ruby scripts/verify-plugins.rb
require 'jekyll'
require 'tmpdir'
require 'fileutils'
require 'json'
require 'nokogiri'
require_relative '../_theme/_plugins/log'
require_relative '../_theme/_plugins/responsive_images'

def verify(condition, message)
  raise message unless condition
end

source = File.expand_path('..', __dir__)
article = '_posts/2.游戏AI/2021-07-19-GameAI.md'
logger = Jekyll::Revision::GitLogger.new(source, article, { 'max_count' => 2 })
expected = Jekyll::Revision::Executor.sh('git', '-C', source, 'log', '--follow', '--format=%ci', '--', article).lines.last.strip
verify(logger.summary['created_at'] == expected, 'Creation date must use full history')
verify(logger.summary['created_at'] != logger.revisions[1]['date'], 'Fixture must exceed display limit')
disabled = Object.new
def disabled.config; { 'git_log' => false }; end
def disabled.posts; raise 'Disabled generator must not read posts'; end
Jekyll::Revision::Generator.new.generate(disabled)

Dir.mktmpdir('responsive-plugin-') do |dir|
  site = Struct.new(:source, :baseurl).new(dir, '/notes')
  def site.in_source_dir(*parts); File.join(source, *parts); end
  FileUtils.mkdir_p(File.join(dir, '_data'))
  manifest_file = site.in_source_dir('_data', 'responsive_images.json')
  File.write(manifest_file, JSON.generate({ '/assets/img/test.png' => {
    'width' => 800, 'height' => 600,
    'webp' => [{ 'src' => '/assets/generated/img/test.webp', 'width' => 480 }]
  } }))
  document = Struct.new(:site, :output)
  doc = document.new(site, '<!doctype html><html><body><img src="/notes/assets/img/test.png" alt="A &amp; B" class="diagram" style="width:50%" title="details" data-test="kept" loading="lazy"><picture><img src="/notes/assets/img/test.png"></picture></body></html>')
  Jekyll::Hooks.trigger(:posts, :post_render, doc)
  html = Nokogiri::HTML5(doc.output)
  img = html.at_css('picture img.diagram')
  verify(img && img['class'] == 'diagram' && img['style'] == 'width:50%' && img['title'] == 'details' && img['data-test'] == 'kept', 'Original image attributes must survive')
  verify(img['alt'] == 'A & B' && img['loading'] == 'lazy', 'Entities and explicit loading must survive')
  verify(img['width'] == '800' && img['height'] == '600', 'Natural dimensions must be supplied')
  verify(html.at_css('source')['srcset'] == '/notes/assets/generated/img/test.webp 480w', 'Variants must respect baseurl')
  verify(html.css('picture').size == 2, 'Existing picture must not be wrapped again')
  verify(html.css('source').size == 1, 'Existing picture must remain untouched')
  cached = Jekyll::ResponsiveImages.manifest(site)
  File.write(manifest_file, '{}')
  verify(Jekyll::ResponsiveImages.manifest(site).equal?(cached), 'Manifest must be cached per build')
  Jekyll::Hooks.trigger(:site, :after_reset, site)
  verify(Jekyll::ResponsiveImages.manifest(site).empty?, 'Build reset must reload manifest')
end

puts 'PASS: revision date/config switch, image attributes/entities/baseurl, existing pictures, manifest cache/reset'
