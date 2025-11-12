query {
  products {
    id
    name
    ... @defer{
      comments
    }
    relatedProducts @stream(initialCount: 1) {
      id
      name
      ... @defer {
        comments
      }
    }
  }
}

new stream query 



query DeferredPosts {
  posts @stream(initialCount: 1) {
    id
    title
    body
    # author will come separately
    ...@defer{
      author{
        id
        name
        bio
      }
    }
  }
}

POSTS STREAM