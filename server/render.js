// @flow

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
        <link rel="apple-touch-icon" sizes="180x180" href="/media/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/media/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/media/favicon-16x16.png">
        <link rel="manifest" href="/media/manifest.json">
        <link rel="mask-icon" href="/media/safari-pinned-tab.svg" color="#ff0000">
        <meta name="theme-color" content="#ffffff">
        <title>
          Live
        </title>
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
router.all("/wall", render);
router.all("/user-list", render);
router.all("/list", render);

export default router;
