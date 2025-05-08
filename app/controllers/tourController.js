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
            // Log the incoming data
            console.log("Request Body:", req.body);
            console.log("Request Files:", req.files);

            const {
                package_name,
                package_title,
                package_description,
                languages,
                package_price,
                service_provider_name,
                service_provider_description,
                package_duration,
                package_category,
                service_provider_email,
                service_provider_phone,
                package_includes,
                package_excludes,
                pickup,
                drop,
                package_state,
            } = req.body;

            const user_id = req.user.userId; // Extract user_id from the token

            // Safely parse JSON fields
            let parsedLanguages = [];
            let parsedIncludes = [];
            let parsedExcludes = [];

            // Validate and process `languages` as an array of objects
            try {
                parsedLanguages = Array.isArray(languages) ? languages : JSON.parse(languages);
                if (!Array.isArray(parsedLanguages)) {
                    throw new Error("Invalid format for languages. Expected an array of objects.");
                }
            } catch (error) {
                console.error("Invalid JSON format in languages:", error.message);
                return failureResponse(res, 400, "Invalid JSON format in languages");
            }

            // Parse `package_includes` and `package_excludes` as JSON
            try {
                parsedIncludes = package_includes ? JSON.parse(package_includes) : [];
            } catch (error) {
                console.error("Invalid JSON format in package_includes:", error.message);
                return failureResponse(res, 400, "Invalid JSON format in package_includes");
            }

            try {
                parsedExcludes = package_excludes ? JSON.parse(package_excludes) : [];
            } catch (error) {
                console.error("Invalid JSON format in package_excludes:", error.message);
                return failureResponse(res, 400, "Invalid JSON format in package_excludes");
            }

            // Construct parsed data
            const parsedData = {
                user_id,
                package_name,
                package_title,
                package_description,
                languages: parsedLanguages, // Save the array of objects directly
                package_price,
                service_provider_name,
                service_provider_description,
                package_duration: package_duration ? package_duration.trim() : null,
                package_category,
                service_provider_email,
                service_provider_phone,
                package_includes: parsedIncludes,
                package_excludes: parsedExcludes,
                pickup,
                drop,
                package_state,
            };

            // Extract uploaded files
            const serviceProviderPicFile = req.files?.service_provider_pic?.[0];
            const serviceProviderPicURL = serviceProviderPicFile?.location;

            const packageCoverPhotoFile = req.files?.package_cover_photo?.[0];
            const packageCoverPhotoURL = packageCoverPhotoFile?.location;

            const mediaFiles = req.files?.mediaFiles?.map(file => file.location) || [];

            // Validate required files
            if (!serviceProviderPicURL) {
                throw new Error("Service provider picture is required.");
            }

            if (!packageCoverPhotoURL) {
                throw new Error("Package cover photo is required.");
            }

            // Add file URLs to parsed data
            parsedData.service_provider_pic = serviceProviderPicURL;
            parsedData.package_cover_photo = packageCoverPhotoURL;

            // Call the service layer to create the tour package
            const result = await TourService.createTourPackageWithMedia(parsedData, mediaFiles);

            return successResponse(res, 201, {
                message: "Tour package created successfully",
                data: result,
            });
        } catch (error) {
            console.error("Error creating tour package:", error);
            return failureResponse(res, 500, "Failed to create tour package", error.message);
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

    async getUserTourPackageTitles(req, res) {
        try {
            const user_id = req.user.userId;

            const tourPackages = await TourService.getUserTourPackageTitles(user_id);

            return res.status(200).json({
                message: "Tour package titles fetched successfully",
                data: tourPackages,
            });
        } catch (error) {
            console.error("Error in TourController.getUserTourPackageTitles:", error.message);
            return res.status(500).json({ error: "Failed to fetch tour package titles" });
        }
    }

    async updateTourPackageWithMedia(req, res) {
        try {
            const user_id = req.user.userId;
            const packageId = req.params.packageId;
            const tourPackageData = { ...req.body, user_id };
            const mediaFiles = req.files;

            const result = await TourService.updateTourPackageWithMedia(packageId, tourPackageData, mediaFiles);

            return res.status(200).json({ message: "Tour package updated successfully", data: result });
        } catch (error) {
            console.error("Error in TourController.updateTourPackageWithMedia:", error.message);
            return res.status(500).json({ error: "Failed to update tour package" });
        }
    }

    async deleteTourPackage(req, res) {
        try {
            const user_id = req.user.userId;
            const packageId = req.params.packageId;

            const result = await TourService.deleteTourPackage(packageId, user_id);

            if (result) {
                return res.status(200).json({ message: "Tour package deleted successfully" });
            } else {
                return res.status(404).json({ error: "Tour package not found or unauthorized" });
            }
        } catch (error) {
            console.error("Error in TourController.deleteTourPackage:", error.message);
            return res.status(500).json({ error: "Failed to delete tour package" });
        }
    }

    async getTourPackagesByCategoryAndCity(req, res) {
        try {
            const { categoryId, cityId } = req.params;

            const tourPackages = await TourService.getTourPackagesByCategoryAndCity(categoryId, cityId);

            return res.status(200).json({
                message: "Tour packages fetched successfully",
                data: tourPackages,
            });
        } catch (error) {
            console.error("Error in TourController.getTourPackagesByCategoryAndCity:", error.message);
            return res.status(500).json({ error: "Failed to fetch tour packages" });
        }
    }

    async getTourPackageById(req, res) {
        try {
            const { packageId } = req.params;

            const tourPackage = await TourService.getTourPackageById(packageId);

            if (!tourPackage) {
                return res.status(404).json({ error: "Tour package not found" });
            }

            return res.status(200).json({
                message: "Tour package fetched successfully",
                data: tourPackage,
            });
        } catch (error) {
            console.error("Error in TourController.getTourPackageById:", error.message);
            return res.status(500).json({ error: "Failed to fetch tour package" });
        }
    }

}



module.exports = new TourController();