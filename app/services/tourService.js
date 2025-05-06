const TourRepository = require('../repositories/tourRepository');
const MediaRepository = require('../repositories/mediaRepository');
const s3 = require('../config/awsS3Config');
const { Media, PackageMedia, TourPackage } = require('../models');
const packageMediaRepository = require('../repositories/packageMediaRepository');

class TourService {

    async uploadToS3(file) {
        try {

            if (!file || !file.buffer) {
                throw new Error('No file buffer found.');
            }

            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: file.originalname,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            };


            const data = await s3.upload(params).promise();
            console.log('File uploaded successfully:', data.Location);
            return data.Location;
        } catch (error) {
            console.error('Error uploading to S3:', error);
            throw new Error('Error uploading to S3: ' + error.message);
        }
    }


    async createTourWithMedia(tourData, mediaFiles) {
        try {

            const tour = await TourRepository.createTour(tourData);


            if (mediaFiles && mediaFiles.length > 0) {
                const mediaPromises = mediaFiles.map(async (mediaUrl) => {
                    const type = mediaUrl.endsWith(".mp4")
                        ? "video"
                        : mediaUrl.endsWith(".png") || mediaUrl.endsWith(".jpg") || mediaUrl.endsWith(".jpeg")
                            ? "image"
                            : "other";

                    const mediaData = {
                        tour_id: tour.tour_id,
                        type: type,
                        media_url: mediaUrl,
                    };


                    await MediaRepository.addMedia(mediaData);
                });


                await Promise.all(mediaPromises);
            }


            if (tourData.cover_photo) {
                tour.cover_photo = tourData.cover_photo;
                await tour.save();
            }

            return tour;
        } catch (error) {
            console.error("Error in creating tour with media:", error);
            throw new Error("Error in creating tour with media: " + error.message);
        }
    }


    async updateTourWithMedia(tourId, tourData, mediaFiles) {
        try {
            const tour = await TourRepository.getTourById(tourId);

            if (!tour) {
                throw new Error("Tour not found");
            }

            // Update tour details
            tour.tour_name = tourData.tour_name;
            tour.tour_title = tourData.tour_title;
            tour.tour_description = tourData.tour_description;
            tour.languages = tourData.languages;
            tour.ticket_price = tourData.ticket_price;
            tour.leader_name = tourData.leader_name;
            tour.leader_description = tourData.leader_description;
            tour.tour_days = tourData.tour_days;
            tour.tour_timings = tourData.tour_timings;
            tour.cities = tourData.cities;
            tour.categories = tourData.categories;
            tour.guide_name = tourData.guide_name;
            tour.guide_phone = tourData.guide_phone;
            tour.guide_email_id = tourData.guide_email_id;

            if (tourData.leader_profile_pic) {
                tour.leader_profile_pic = tourData.leader_profile_pic;
            }

            if (tourData.cover_photo) {
                tour.cover_photo = tourData.cover_photo;
            }

            if (mediaFiles && mediaFiles.length > 0) {
                const mediaPromises = mediaFiles.map(async (mediaFile) => {
                    if (!mediaFile.type || !mediaFile.location) {
                        console.log("Missing type or location in mediaFile:", mediaFile);
                        return;
                    }

                    if (mediaFile.media_id) {
                        const mediaToUpdate = tour.media.find((m) => m.media_id === mediaFile.media_id);

                        if (mediaToUpdate) {
                            mediaToUpdate.media_url = mediaFile.location;
                            mediaToUpdate.type = mediaFile.type;

                            await mediaToUpdate.save();
                        } else {
                            console.log("Media to update not found:", mediaFile.media_id);
                        }
                    } else {
                        const newMedia = await Media.create({
                            tour_id: tourId,
                            type: mediaFile.type,
                            media_url: mediaFile.location,
                        });

                        console.log("Created new media:", newMedia);

                        tour.media.push(newMedia);
                    }
                });

                await Promise.all(mediaPromises);
            } else {
                console.log("No new media files provided, skipping media update.");
            }

            await tour.save();

            return tour;
        } catch (error) {
            console.error("Error updating tour with media:", error);
            throw new Error("Failed to update tour: " + error.message);
        }
    }


    async deleteTourById(tourId) {
        try {
            const tour = await TourRepository.getTourById(tourId, {
                include: [{ model: Media, as: 'media' }]
            });

            if (!tour) {
                throw new Error('Tour not found');
            }

            await Media.destroy({ where: { tour_id: tourId } });

            await tour.destroy();

            return { message: 'Tour and associated media deleted successfully' };
        } catch (error) {
            console.error('Error deleting tour:', error);
            throw new Error('Failed to delete tour: ' + error.message);
        }
    }

    async getAllToursByUser(userId) {
        try {
            const tours = await TourRepository.getAllToursByUser(userId);

            if (!tours || tours.length === 0) {
                throw new Error("No tours found for the user");
            }

            return tours;
        } catch (error) {
            console.error("Error fetching tours:", error);
            throw new Error("Failed to fetch tours: " + error.message);
        }
    }

    async getAllToursConsumers() {
        try {
            const tours = await TourRepository.getAllTours();

            return tours;
        } catch (error) {
            console.error('Error fetching all tours from the database:', error);
            throw error;
        }
    }

    async getToursByCategoryAndCity(categoryId, cityId) {
        try {

            const tours = await TourRepository.findByCategoryAndCity(categoryId, cityId);
            return tours;
        } catch (error) {
            throw new Error('Failed to fetch tours by category and city');
        }
    }


    async getAllCities() {
        try {
            return await TourRepository.findAllCities();
        } catch (error) {
            throw new Error('Failed to fetch cities');
        }
    }

    async getAllCategories() {
        return await TourRepository.getAllCategories();
    };

    async getAllStates() {
        try {
            const states = await TourRepository.getAllStates();
            return states;
        } catch (error) {
            console.error('Error fetching states:', error);
            throw new Error('Failed to fetch states: ' + error.message);
        }
    }

    async getAllPackages() {
        try {
            const packages = await TourRepository.getAllPackages();
            return packages;
        } catch (error) {
            console.error('Error fetching packages:', error);
            throw new Error('Failed to fetch packages: ' + error.message);
        }
    }

    async createTourPackageWithMedia(tourPackageData, files) {
        try {
            if (files.service_provider_pic && files.service_provider_pic.length > 0) {
                const serviceProviderPicUrl = files.service_provider_pic[0].location;
                tourPackageData.service_provider_pic = serviceProviderPicUrl;
            }

            if (files.package_cover_photo && files.package_cover_photo.length > 0) {
                const packageCoverPhotoUrl = files.package_cover_photo[0].location;
                tourPackageData.package_cover_photo = packageCoverPhotoUrl;
            }

            const tourPackage = await TourRepository.createTourPackage(tourPackageData);

            if (files.mediaFiles && files.mediaFiles.length > 0) {
                const mediaPromises = files.mediaFiles.map(async (file) => {
                    const mediaUrl = file.location;
                    const type = file.mimetype.startsWith("image/")
                        ? "image"
                        : file.mimetype.startsWith("video/")
                            ? "video"
                            : "other";

                    const mediaData = {
                        package_id: tourPackage.package_id,
                        type: type,
                        media_url: mediaUrl,
                    };

                    await packageMediaRepository.addMedia(mediaData);
                });

                await Promise.all(mediaPromises);
            }

            return tourPackage;
        } catch (error) {
            console.error("Error in TourPackageService.createTourPackageWithMedia:", error.message);
            throw new Error("Failed to create tour package");
        }
    }

    async getToursByCategoryAndState(package_category, package_state) {
        try {
            const tours = await TourPackage.findAll({
                where: {
                    package_category,
                    package_state,
                },
            });

            return tours;
        } catch (error) {
            console.error("Error in TourService.getToursByCategoryAndState:", error.message);
            throw new Error("Failed to fetch tours");
        }
    }

    async getUserTourPackageTitles(user_id) {
        try {
            const tourPackages = await TourPackage.findAll({
                where: { user_id },
                attributes: ["package_id", "package_title"],
            });

            return tourPackages;
        } catch (error) {
            console.error("Error in TourService.getUserTourPackageTitles:", error.message);
            throw new Error("Failed to fetch tour package titles");
        }
    }


    async updateTourPackageWithMedia(packageId, tourPackageData, files) {
        try {

            const tourPackage = await TourPackage.findOne({ where: { package_id: packageId, user_id: tourPackageData.user_id } });

            if (!tourPackage) {
                throw new Error("Tour package not found or unauthorized");
            }


            if (files.service_provider_pic && files.service_provider_pic.length > 0) {
                const serviceProviderPicUrl = files.service_provider_pic[0].location;
                tourPackageData.service_provider_pic = serviceProviderPicUrl;
            }


            if (files.package_cover_photo && files.package_cover_photo.length > 0) {
                const packageCoverPhotoUrl = files.package_cover_photo[0].location;
                tourPackageData.package_cover_photo = packageCoverPhotoUrl;
            }


            await tourPackage.update(tourPackageData);


            if (files.mediaFiles && files.mediaFiles.length > 0) {

                await PackageMedia.destroy({ where: { package_id: packageId } });


                const mediaPromises = files.mediaFiles.map(async (file) => {
                    const mediaUrl = file.location;
                    const type = file.mimetype.startsWith("image/")
                        ? "image"
                        : file.mimetype.startsWith("video/")
                            ? "video"
                            : "other";

                    const mediaData = {
                        package_id: packageId,
                        type: type,
                        media_url: mediaUrl,
                    };

                    await PackageMedia.create(mediaData);
                });

                await Promise.all(mediaPromises);
            }

            return tourPackage;
        } catch (error) {
            console.error("Error in TourService.updateTourPackageWithMedia:", error.message);
            throw new Error("Failed to update tour package");
        }
    }

    async deleteTourPackage(packageId, user_id) {
        try {
            const tourPackage = await TourPackage.findOne({ where: { package_id: packageId, user_id } });

            if (!tourPackage) {
                return false;
            }

            await tourPackage.destroy();
            return true;
        } catch (error) {
            console.error("Error in TourService.deleteTourPackage:", error.message);
            throw new Error("Failed to delete tour package");
        }
    }

    async getTourPackagesByCategoryAndCity(categoryId, cityId) {
        try {
            const tourPackages = await TourPackage.findAll({
                where: {
                    package_category: categoryId,
                    package_state: cityId,
                },
                attributes: [
                    "package_id",
                    "package_name",
                    "service_provider_name",
                    "package_price",
                    "package_cover_photo",
                    "languages",
                ],

            });

            return tourPackages;
        } catch (error) {
            console.error("Error in TourService.getTourPackagesByCategoryAndCity:", error.message);
            throw new Error("Failed to fetch tour packages");
        }
    }

}

module.exports = new TourService();
