route.base "/"

# navigationRoute = route.create()
# navigationRoute "/", ->
#   riot.mount "#navigation", "top-navigation"
# navigationRoute "/*", (page) ->
#   riot.mount "#navigation", "top-navigation",
#     page: page
# navigationRoute "/*/..", (page) ->
#   riot.mount "#navigation", "top-navigation",
#     page: page

# root of the site
route "/", ->
  # console.log "login routing..."
  riot.mount "#main", "main-page"

route "/*", (pageName) ->
  riot.mount "#main", "#{pageName}-page"

route.start true
