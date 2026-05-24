source "https://rubygems.org"

# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!

gem 'jekyll', '~> 4.4', '>= 4.4.1'

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
end

# 🛠️ 修复弃用警告：将旧的 :mingw, :x64_mingw, :mswin 替换为新版推荐的 :windows
# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :windows, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# 🛠️ 修复弃用警告：同样将此处的平台声明修改为 :windows
# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => :windows
gem "webrick", "~> 1.7"
gem "jekyll-mermaid", "~> 1.0"
gem 'jekyll-sass-converter', "~> 3.1"
gem 'jekyll-seo-tag'

# 🚀 解决 sass-embedded 编译报错的核心：强制使用不含 bug 的新版 json 核心库
gem 'json', '>= 2.7.2'