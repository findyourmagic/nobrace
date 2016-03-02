express = require 'express'
router = express.Router()

# GET users listing.
router.get '/', (req, res) ->
  res.send 'users'

module.exports = router
