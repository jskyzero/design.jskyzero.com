# frozen_string_literal: true

require 'fileutils'
require 'pathname'
require 'jekyll-last-modified-at'

module Recents
  # Generate change information for all markdown pages
  class Generator < Jekyll::Generator
    def generate(site)
      items = site.posts.docs.select { |p| p.path.end_with? '.md' }
      items.each do |page|
        page.data['last_modified_at_str'] = Jekyll::LastModifiedAt::Determinator.new(site.source, page.path, '%FT%T%:z').to_s
      end
      puts("FINISH: jekyll-last-modified-at")
    end
  end
end