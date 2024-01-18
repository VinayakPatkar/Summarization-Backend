const express = require("express");
const router = require("express").Router();
const userController = require("../controllers/userController");
const upload_pdf = require("../middlewares/upload_pdf");
router.post("/signup",userController.signup);
router.post("/login",userController.login);
router.post("/pdfupload",upload_pdf.single("pdf"),userController.upload);
module.exports = router;