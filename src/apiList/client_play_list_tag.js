
module.exports = (app) => {
  app.get('/client_play_list_tag', async (req, res) => {
    try {
      let result = await app.request({
        url: "client_play_list_tag",
        data: {
          ...req.query
        }
      })
      res.send(result.data)
    } catch (err) {
      res.send({ code: -500, msg: err.message })
    }
  })
}