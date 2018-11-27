---
layout: page
title: Categories
permalink: /categories/
---

<div>
{% assign categories = site.categories | sort %}
{% for category in categories %}
  <div class="archive-group">
    {% capture category_name %}{{ category | first }}{% endcapture %}
    <div id="#{{ category_name | slugize }}">
    <p></p>
    <h3 class="category-head">{{ category_name }}</h3>
    <a name="{{ category_name | slugize }}"></a>
    </div>
    {% assign each_categories = site.categories[category_name] %}
    {% assign each_categories = each_categories | sort: "title" %}
    {% for post in each_categories %}
    <article class="archive-item">
      <h4><a href="{{ site.baseurl }}{{ post.url }}">{{post.title}}</a></h4>
    </article>
    {% endfor %}
  </div>
{% endfor %}
</div>