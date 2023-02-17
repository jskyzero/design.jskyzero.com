# Designer-Notes
[![Jekyll](https://github.com/jskyzero/design.jskyzero.com/actions/workflows/jekyll.yml/badge.svg?branch=jekyll)](https://github.com/jskyzero/design.jskyzero.com/actions/workflows/jekyll.yml)
![GitHub last commit](https://img.shields.io/github/last-commit/jskyzero/design.jskyzero.com)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/w/jskyzero/design.jskyzero.com/jekyll)


jskyzero's notes about game designer.


## How to use

You can view it via [website](https://design.jskyzero.com/), or you can download the source file and run in your local machine.


### Daily Use

+ serve: `bundle exec jekyll serve`
+ change file ext name: `for x in *.jpeg; do mv "$x" "${x%.jpeg}.jpg"; done`
+ mermaid: `./node_modules/.bin/mmdc -h`, `mmdc -i input.mmd -o output.svg`

+ CompatibilityError:

```ruby
# Encoding::CompatibilityError: incompatible encoding regexp match (UTF-8 regexp with ASCII-8BIT string)

# /opt/homebrew/lib/ruby/gems/3.1.0/gems/listen-3.7.1/lib/listen/adapter/darwin.rb:69:in `_process_event'

rel_path = path.relative_path_from(dir).to_s.force_encoding('utf-8')

```

<!-- ```ruby
# Encoding::CompatibilityError: incompatible encoding regexp match (UTF-8 regexp with ASCII-8BIT string)

# /opt/homebrew/lib/ruby/gems/3.1.0/gems/listen-3.7.1/lib/listen/silencer.rb

def _ignore?(path)
      if path.encoding.to_s == 'ASCII-8BIT'
        path = path.force_encoding(Encoding::ISO_8859_1).encode!('utf-8')
      end
      ignore_patterns.any? { |pattern| path =~ pattern }
    end
``` -->
+ draw a picture: `xmind`, `draw.io`, `marmaid`


## Change Log

+ 2023/02/17: change theme to light

## License

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.


The Theme forks from [jekyll-theme-console](https://github.com/b2a3e8/jekyll-theme-console) under [MIT License](https://opensource.org/licenses/MIT).
