const { successResponse, failureResponse } = require('../utils/responseHandler');
const TourService = require('../services/tourService');
const TourRepository = require('../repositories/tourRepository');

class TourController {
    async createTourWithMedia(req, res) {
        try {
            const {
                tour_name,
                tour_title,
                tour_description,
                languages,
                ticket_price,
                leader_name,
                leader_description,
                days,
                city_id,
                category_id,
                guide_name,
                guide_phone,
                guide_email_id,
                meeting_point,
                tour_duration,
                tour_includes,
                tour_excludes,
            } = req.body;

            const user_id = req.user.userId;

            let parsedDays = [];
            if (req.body.days) {
                try {
                    let rawDays;

                    if (typeof req.body.days === 'string') {
                        console.log("Parsing days string...");
                        rawDays = JSON.parse(req.body.days);
                    } else {
                        console.log("Already parsed days object...");
                        rawDays = req.body.days;
                    }

                    const daysArray = Array.isArray(rawDays) ? rawDays : [rawDays];

                    parsedDays = daysArray
                        .filter(d => d && d.day && Array.isArray(d.times))
                        .map(d => ({
                            day: d.day.trim(),
                            times: d.times,
                        }));

                } catch (err) {
                    console.error('Failed to parse days:', err);
                    return failureResponse(res, 400, 'Invalid JSON format in days');
                }
            }




            const parsedData = {
                user_id,
                tour_name,
                tour_title,
                tour_description,
                languages: languages ? JSON.parse(languages) : [],
                ticket_price,
                leader_name,
                leader_description,
                city_id,
                category_id,
                guide_name,
                guide_phone,
                guide_email_id,
                meeting_point,
                tour_duration: tour_duration ? tour_duration.trim() : null,
                tour_includes: tour_includes ? JSON.parse(tour_includes) : [],
                tour_excludes: tour_excludes ? JSON.parse(tour_excludes) : [],
                tour_days: parsedDays,
            };

            const leaderProfilePicFile = req.files?.leader_profile_pic?.[0];
            const leaderProfilePicURL = leaderProfilePicFile?.location;

            const coverPhotoFile = req.files?.cover_photo?.[0];
            const coverPhotoURL = coverPhotoFile?.location;

            const mediaFiles = req.files?.media?.map(file => file.location) || [];

            if (!leaderProfilePicURL) {
                throw new Error('Leader profile picture is required.');
            }

            if (!coverPhotoURL) {
                throw new Error('Cover photo is required.');
            }

            parsedData.leader_profile_pic = leaderProfilePicURL;
            parsedData.cover_photo = coverPhotoURL;

            const result = await TourService.createTourWithMedia(parsedData, mediaFiles);

            return successResponse(res, 201, {
                message: 'Tour created successfully',
                data: result,
            });
        } catch (error) {
            console.error('Error creating tour:', error);
            return failureResponse(res, 500, 'Failed to create tour', error.message);
        }
    }



    async updateTourWithMedia(req, res) {
        try {
            const { tourId } = req.params;


            const {
                tour_name,
                tour_title,
                tour_description,
                languages,
                ticket_price,
                leader_name,
                leader_description,
                days,
                city_id,
                category_id,
                guide_name,
                guide_phone,
                guide_email_id,
                meeting_point,
                tour_duration,
                tour_includes,
                tour_excludes,
            } = req.body;

            const user_id = req.user.userId;

            const parsedData = {
                user_id,
                tour_name,
                tour_title,
                tour_description,
                languages: languages ? JSON.parse(languages) : [],
                ticket_price,
                leader_name,
                leader_description,
                city_id,
                category_id,
                guide_name,
                guide_phone,
                guide_email_id,
                meeting_point,
                tour_duration: tour_duration ? tour_duration.trim() : null,
                tour_includes: tour_includes ? JSON.parse(tour_includes) : [],
                tour_excludes: tour_excludes ? JSON.parse(tour_excludes) : [],
                tour_days: days
                    ? (Array.isArray(days)
                        ? days.map(day => JSON.parse(day))
                        : [JSON.parse(days)])
                    : [],
            };


            const leaderProfilePicFile = req.files?.leader_profile_pic?.[0];
            const leaderProfilePicURL = leaderProfilePicFile?.location;

            const coverPhotoFile = req.files?.cover_photo?.[0];
            const coverPhotoURL = coverPhotoFile?.location;

            const mediaFiles = req.files?.media?.map(file => file.location) || [];

            if (leaderProfilePicURL) {
                parsedData.leader_profile_pic = leaderProfilePicURL;
            }

            if (coverPhotoURL) {
                parsedData.cover_photo = coverPhotoURL;
            }



            const updatedTour = await TourService.updateTourWithMedia(
                tourId,
                parsedData,
                mediaFiles
            );


            return successResponse(res, 200, {
                message: 'Tour updated successfully',
                data: updatedTour,
            });
        } catch (error) {
            console.error('Error updating tour:', error);
            return failureResponse(res, 500, 'Failed to update tour', error.message);
        }
    }




    async getTourById(req, res) {
        try {
            const { tourId } = req.params;


            const tour = await TourRepository.getTourById(tourId);


            if (!tour) {
                return res.status(404).json({
                    success: false,
                    message: 'Tour not found',
                });
            }

            console.log("this is the tour data by id", tour)


            return res.status(200).json({
                success: true,
                message: 'Tour fetched successfully',
                tour,
            });
        } catch (error) {
            console.error('Error fetching tour:', error);


            return res.status(500).json({
                success: false,
                message: 'Failed to fetch tour',
                error: error.message,
            });
        }
    }



    async deleteTour(req, res) {
        try {
            const { tourId } = req.params;


            const result = await TourService.deleteTourById(tourId);


            return res.status(200).json({
                message: result.message,
            });
        } catch (error) {
            console.error('Error deleting tour:', error);
            return res.status(500).json({
                message: 'Failed to delete tour',
                error: error.message,
            });
        }
    }

    async getAllTours(req, res) {
        try {
            const userId = req.user.userId;

            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            const tours = await TourService.getAllToursByUser(userId);

            return res.status(200).json({
                message: 'Tours fetched successfully',
                data: tours,
            });
        } catch (error) {
            console.error('Error fetching tours:', error);
            return res.status(500).json({
                message: 'Failed to fetch tours',
                error: error.message,
            });
        }
    }


    async getAllToursConsumer(req, res) {
        try {

            const tours = await TourService.getAllToursConsumers();


            return res.status(200).json({
                message: 'Tours fetched successfully',
                data: tours,
            });
        } catch (error) {
            console.error('Error fetching tours:', error);
            return res.status(500).json({
                message: 'Failed to fetch tours',
                error: error.message,
            });
        }
    }

    async getToursByCategoryAndCity(req, res) {
        try {
            const { categoryId, cityId } = req.params;

            const tours = await TourService.getToursByCategoryAndCity(categoryId, cityId);

            if (!tours.length) {
                return res.status(404).json({ message: 'No tours found for this category and city' });
            }


            const formattedTours = tours.map((tour) => tour.get({ plain: true }));
            console.log("Formatted tours:", formattedTours);

            return res.status(200).json({ tours: formattedTours });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }





    async getUserTourTitles(req, res) {
        try {
            const userId = req.user.userId;

            const tours = await TourRepository.getUserTourTitles(userId);

            return res.status(200).json({
                success: true,
                message: 'Tour titles fetched successfully',
                tours: tours || [],
            });
        } catch (error) {
            console.error('Error fetching user tour titles:', error);


            if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid or expired token',
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Failed to fetch user tour titles',
                error: error.message,
            });
        }
    }



    async getAllCities(req, res) {
        try {
            const cities = await TourService.getAllCities();
            return res.status(200).json({ cities });
        } catch (error) {
            console.error("Error fetching cities:", error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await TourService.getAllCategories();
            return res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching categories', error: error.message });
        }
    };

    async getAllStates(req, res) {
        try {
            const states = await TourService.getAllStates();
            return res.status(200).json(states);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching states', error: error.message });
        }
    }

    async getAllPackages(req, res) {
        try {
            const packages = await TourService.getAllPackages();
            return res.status(200).json(packages);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching packages', error: error.message });
        }
    }

    async createTourPackageWithMedia(req, res) {
        try {
            const user_id = req.user.userId; 
            const tourPackageData = { ...req.body, user_id }; 
            const mediaFiles = req.files;

            const result = await TourService.createTourPackageWithMedia(tourPackageData, mediaFiles);

            return res.status(201).json({ message: "Tour package created successfully", data: result });
        } catch (error) {
            console.error("Error in TourPackageController.createTourPackageWithMedia:", error.message);
            return res.status(500).json({ error: "Failed to create tour package" });
        }
    }

    async getToursByCategoryAndState(req, res) {
        try {
            const { package_category, package_state } = req.query;


            if (!package_category || !package_state) {
                return res.status(400).json({ error: "package_category and package_state are required" });
            }

            const tours = await TourService.getToursByCategoryAndState(
                parseInt(package_category, 10),
                parseInt(package_state, 10)
            );

            return res.status(200).json({ message: "Tours fetched successfully", data: tours });
        } catch (error) {
            console.error("Error in TourController.getToursByCategoryAndState:", error.message);
            return res.status(500).json({ error: "Failed to fetch tours" });
        }
    }

}



module.exports = new TourController();