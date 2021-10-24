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
    {% unless category_name contains '日常' %}
    <div id="#{{ category_name | slugize }}">
    <a name="{{ category_name | slugize }}"></a>
    <!-- <p></p> -->
    <h3 class="category-head">{{ category_name }} ({{ site.categories[category_name] | size}})</h3>
    </div>
    {% assign each_categories = site.categories[category_name] %}
    {% assign each_categories = each_categories | sort: "title" %}
    {% for post in each_categories %}
    <article class="archive-item">
      <h4><a href="{{ site.baseurl }}{{ post.url }}">{{post.title}}</a></h4>
    </article>
    {% endfor %}
    {% endunless %}
  </div>
{% endfor %}
</div>
