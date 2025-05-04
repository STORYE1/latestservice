const express = require('express');
const { tourUploadMiddleware, tourPackageUploadMiddleware, handleUploadErrors } = require('../middleware/uploadMiddleware');
const AuthenticationMiddleware = require('../middleware/authenticationMiddleware');
const TourController = require("../controllers/tourController")

const router = express.Router();

router.post(
    "/create",
    AuthenticationMiddleware.authenticate,
    tourUploadMiddleware,
    handleUploadErrors,
    TourController.createTourWithMedia
);

router.put(
    '/update/:tourId',
    AuthenticationMiddleware.authenticate,
    tourUploadMiddleware,
    handleUploadErrors,
    TourController.updateTourWithMedia
);

router.delete(
    '/delete/:tourId',
    AuthenticationMiddleware.authenticate,
    TourController.deleteTour
);

router.get(
    '/tours',
    AuthenticationMiddleware.authenticate,
    TourController.getAllTours
);

router.get(
    '/tours/category/:categoryId/:cityId',
    TourController.getToursByCategoryAndCity
);


router.get(
    '/user/tourTitles',
    AuthenticationMiddleware.authenticate,
    TourController.getUserTourTitles
);


router.get('/consumerTours', TourController.getAllToursConsumer);

router.get('/tours/:tourId', TourController.getTourById);

router.get('/cities', TourController.getAllCities);

router.get('/categories', TourController.getAllCategories);

router.get("/states", TourController.getAllStates);

router.get("/packages", TourController.getAllPackages);

router.post(
    "/tourpackage",
    AuthenticationMiddleware.authenticate,
    tourPackageUploadMiddleware,
    handleUploadErrors,
    TourController.createTourPackageWithMedia
);

router.get(
    "/packagetours/filter",
    TourController.getToursByCategoryAndState
);


module.exports = router;
