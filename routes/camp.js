let express = require("express");
let router = express.Router();
let catchAsync = require('../Error/catch_Async')
let Campground = require("../models/campground");
//let Review = require('./models/review')

let {isLoggedIn} = require('../auth_middlware')

router.get("/", catchAsync(async (req, res, next) => {
  let result = await Campground.find({});
  res.render("campgrounds/index", { result });
}));

router.get("/new", isLoggedIn, (req, res) => {
  //
  res.render("campgrounds/new");
});

router.post("/", isLoggedIn,catchAsync(async (req, res, next) => {
  let another = new Campground(req.body);
  await another.save();
  console.log(another);
  req.flash("success", "Successfully created new campgrounds");
  res.redirect(`/campgrounds/${another._id}`);
}));

router.get("/:id", catchAsync(async (req, res, next) => {
  let id = await Campground.findById(req.params.id).populate("reviews");
  if (!id) {
    req.flash("error", "Campground is not found");
     return res.redirect("/campgrounds");
  }
  res.render("campgrounds/id", { id });
}));

router.get("/:id/edit",isLoggedIn, catchAsync(async (req, res, next) => {
  let edit = await Campground.findById(req.params.id);
  if (!edit) {
    req.flash("error", "Campground is not found");
     return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { edit });
}));

router.put("/:id", isLoggedIn , catchAsync(async (req, res, next) => {
  let put = await Campground.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  req.flash("success", "Successfully update this campground");
  res.redirect(`/campgrounds/${put._id}`);
}));

router.delete("/:id",isLoggedIn, catchAsync(async (req, res) => {
  let dlt = await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully delete the campground");
  res.redirect("/campgrounds");
}));

module.exports = router;
