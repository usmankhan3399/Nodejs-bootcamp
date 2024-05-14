const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

//when we export anything by using export.getAllUser and import it in a object then this object contains all the data exported in a single object

//we imported the tour handlers and saved it inside tourController
// after that we can use it in like tourController.getAllTours etc

// we can also do the above process by destructuring like the below commented code when we use this method we simply have to state
// all the exports in the tour controller and dont have to use tourcontroller.getAlltours instead we directly call it like .get(getAllTours)

// const {
//   getAllTours,
//   createTour,
//   getTour,
//   updateTour,
//   deleteTour,
// } = require('./../controllers/tourController');

const router = express.Router(); // Tour Router middelware

// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  // .post(tourController.checkBody, tourController.createTour);
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
