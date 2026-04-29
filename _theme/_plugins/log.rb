# Jekyll plugin: Git revision log generator
# Appends git commit history to each post's frontmatter as `page.revisions`.
# Usage: enable via `git_log: true` in _config.yml.
# Skips when passing `--no-revision` flag to `jekyll build`.
#
# References:
#   https://github.com/aleung/jekyll-post-revision/blob/master/plugins/revision.rb
#   https://github.com/gjtorikian/jekyll-last-modified-at

require 'open3'

module Jekyll
  module Revision

    # Main generator - runs during Jekyll build
    class Generator < Jekyll::Generator
      def generate(site)
        return if site.data['git_log'] == false
        return if ARGV.include?("--no-revision")

        # Process all posts (not pages) for revision history
        %w(posts).each do |type|
          site.send(type).docs.each do |item|
            item.data['revisions'] = GitLogger.new(site.source, item.path, site.config['revision']).revisions
          end
        end
        puts("FINISH: post-data-revision")
      end
    end

    # Fetches git log for a given file path
    class GitLogger
      attr_reader :site_source, :page_path, :config

      def initialize(site_source, page_path, config = {})
        @site_source = site_source
        @page_path   = page_path
        @config      = config || {}
      end

      # Returns array of revision hashes: { date, author, message }
      def revisions
        return nil unless is_git_repo?
        logs = Executor.sh('git', 'log', '--follow',
              '--pretty=%ci|%an|%s',
              '--max-count=' + max_count.to_s,
              relative_path_from_git_dir)
        logs.lines.map do |line|
          parts = line.split('|')
          {"date" => parts[0], "author" => parts[1], "message" => parts[2..-1].join('|')}
        end
      end

      private

      # Maximum git log entries to fetch (default 20)
      def max_count
        config['max_count'] || 20
      end

      # Check if current directory is inside a git repo
      def is_git_repo?
        @@is_git_repo ||= begin
          Dir.chdir(site_source) do
            Executor.sh("git", "rev-parse", "--is-inside-work-tree").eql? "true"
          end
        rescue
          false
        end
      end

      def absolute_path_to_article
        @article_file_path ||= Jekyll.sanitized_path(site_source, @page_path)
      end

      # Get file path relative to git root directory
      def relative_path_from_git_dir
        @relative_path_from_git_dir ||= Pathname.new(absolute_path_to_article)
          .relative_path_from(
            Pathname.new(File.dirname(top_level_git_directory))
          ).to_s
      end

      def top_level_git_directory
        @@top_level_git_directory ||= begin
          Dir.chdir(site_source) do
            top_level_git_directory = File.join(Executor.sh("git", "rev-parse", "--show-toplevel"), ".git")
          end
        rescue
          ""
        end
      end
    end

    # Shell command executor
    module Executor
      def self.sh(*args)
        Open3.popen2e(*args) do |stdin, stdout_stderr, wait_thr|
          exit_status = wait_thr.value
          output = stdout_stderr.read
          output ? output.strip : nil
        end
      end
    end

  end
end