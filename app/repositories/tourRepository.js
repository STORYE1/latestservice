const { Tour, Media, City, Category } = require("../models");

class TourRepository {
    /**
     * Create a new tour entry in the database.
     * @param {Object} tourData - Data for creating a tour.
     * @returns {Promise<Object>} - The created tour object.
     */
    async createTour(tourData) {
        try {
            // Ensure media is always an array
            if (!tourData.media || !Array.isArray(tourData.media)) {
                tourData.media = [];
            }

            const tour = await Tour.create(tourData);
            return tour;
        } catch (error) {
            console.error('Error creating tour:', error);
            throw new Error('Failed to create tour: ' + error.message);
        }
    }

    /**
     * Update an existing tour in the database.
     * @param {number} tourId - ID of the tour to update.
     * @param {Object} tourData - Data for updating the tour.
     * @returns {Promise<Object>} - The updated tour object.
     */
    async updateTour(tourId, tourData) {
        try {

            const tour = await Tour.findByPk(tourId);

            if (!tour) {
                throw new Error('Tour not found');
            }


            tour.tour_name = tourData.tour_name;
            tour.tour_title = tourData.tour_title;

            await tour.save();

            return tour;
        } catch (error) {
            console.error('Error updating tour:', error);
            throw new Error('Failed to update tour: ' + error.message);
        }
    }

    /**
     * Fetch a tour by its ID along with its associated media.
     * @param {number} tourId - ID of the tour to fetch.
     * @returns {Promise<Object>} - The fetched tour object with media.
     */
    async getTourById(tourId) {
        try {
            return await Tour.findByPk(tourId, {
                include: [{ model: Media, as: 'media' }]
            });
        } catch (error) {
            console.error('Error fetching tour by ID:', error);
            throw new Error('Failed to fetch tour: ' + error.message);
        }
    }

    /**
     * Delete all media associated with a specific tour.
     * @param {number} tourId - ID of the tour to delete media for.
     * @returns {Promise<void>}
     */
    async deleteMediaByTourId(tourId) {
        try {

            const tour = await Tour.findByPk(tourId, {
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

    /**
     * Add new media to a tour.
     * @param {Object} mediaData - The data for the new media.
     * @returns {Promise<Object>} - The created media object.
     */
    async addMedia(mediaData) {
        try {
            const media = await Media.create(mediaData);
            return media;
        } catch (error) {
            console.error('Error adding media:', error);
            throw new Error('Failed to add media: ' + error.message);
        }
    }

    async getAllToursByUser(userId) {
        try {
            const tours = await Tour.findAll({
                where: { user_id: userId },
                include: [
                    {
                        model: Media,
                        as: "media",
                        attributes: null,
                    },
                ],
                attributes: null,
            });

            return tours;
        } catch (error) {
            console.error("Error fetching tours from the database:", error);
            throw error;
        }
    }

    async getAllTours() {
        try {
            const tours = await Tour.findAll({
                include: [
                    {
                        model: Media,
                        as: 'media',

                    },
                ],

            });

            return tours;
        } catch (error) {
            console.error('Error fetching all tours from the database:', error);
            throw error;
        }
    }

    async findByCategoryAndCity(categoryId, cityId) {
        try {
            const tours = await Tour.findAll({
                attributes: [
                    'tour_id',
                    'tour_name',
                    'leader_name',
                    'ticket_price',
                    'cover_photo',
                ],
                where: {
                    category_id: categoryId,
                    city_id: cityId,
                },
                include: [
                    {
                        model: City,
                        as: 'city',
                        attributes: ['city_id', 'value'],
                    },
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['category_id', 'value'],
                    },
                ],
            });

            return tours;
        } catch (error) {
            throw new Error('Failed to fetch tours by category and city');
        }
    }



    async getUserTourTitles(userId) {
        try {
            return await Tour.findAll({
                where: { user_id: userId },
                attributes: ['tour_id', 'tour_name'],
            });
        } catch (error) {
            console.error('Error fetching user tour titles:', error);
            throw new Error('Failed to fetch user tour titles: ' + error.message);
        }
    }

    async findAllCities() {
        try {

            return await City.findAll({
                attributes: ['city_id', 'value'],
            });
        } catch (error) {
            throw new Error('Failed to fetch cities from database');
        }
    }

    async getAllCategories() {
        try {
            return await Category.findAll();
        } catch (error) {
            throw new Error('Error fetching categories from the database');
        }
    };

}

module.exports = new TourRepository();
