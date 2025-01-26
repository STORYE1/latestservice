const { Media } = require("../models");

class MediaRepository {
    async addMedia(mediaData) {
        try {
            
            const mediaArray = Array.isArray(mediaData) ? mediaData : [mediaData];

            const media = await Media.bulkCreate(mediaArray, { returning: true });
            return media;
        } catch (error) {
            console.error('Error saving media:', error);
            throw new Error('Error saving media: ' + error.message);
        }
    }

}

module.exports = new MediaRepository();
