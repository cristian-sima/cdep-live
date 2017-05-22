import express from "express";

const
  router = express.Router(),
  render = (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="ro">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>
          Live
        </title>
        <!-- <link rel="icon" href="/static/logo.ico"> -->
      </head>
      <body>
        <div id="root"></div>
      </body>
      <script src="/static/app.js" charset="utf-8"></script>
      </html>
    `);
  };

router.all("/", render);
router.all("/login", render);
router.all("/user-list", render);

export default router;
