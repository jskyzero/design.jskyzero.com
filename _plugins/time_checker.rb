# # does not work 
# # unhappy


# module Jekyll
#   module TimeFilter
#     private
#     def compare(posted_time, modified_time)
#       # checker = DateTime.new(2021, 10, 1, 0, 0, 0, now.zone).to_s
#       # posted_time > checker
#       false
#     end

#     def sort_post_filter(posts)
#       posts.select { |post|
#         posted_time = post.data['date'].to_datetime.to_s
#         modified_time = post.data['last_modified_at'].to_datetime.to_s

#         compare(posted_time, modified_time)
#       }
#     end

#   def default_post_filter(posts)
#     posts.select { |post|
#         posted_time = post.data['date'].to_datetime.to_s
#         modified_time = post.data['last_modified_at'].to_datetime.to_s

#         not compare(posted_time, modified_time)
#     }
#   end
# end
# end

# Liquid::Template.register_filter(Jekyll::TimeFilter)