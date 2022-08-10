
module.exports = (app) => {
  console.log('---进来饿了---')
  app.post('/api/history/getPowerHistoryData', async (req, res) => {
    console.log('--2331213231---', req.header.cookie);
    try {
      let result = await app.request({
        url: "/api/history/getPowerHistoryData",
        method: 'post',
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