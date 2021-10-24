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
        modified_time = Jekyll::LastModifiedAt::Determinator.new(site.source, page.path, '%FT%T%:z').to_s
        check_time = Time.new(2021,10).strftime('%FT%T%:z')
        if modified_time > check_time
          page.data['last_modified_at_str'] = modified_time
          page.data['use_modified'] = true
        else
          page.data['last_modified_at_str'] = check_time
          page.data['use_modified'] = false
        end
      end
      puts("FINISH: jekyll-last-modified-at")
    end
  end
end