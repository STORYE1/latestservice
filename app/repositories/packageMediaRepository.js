const { PackageMedia } = require("../models");

class PackageMediaRepository {
    async addMedia(mediaData) {
        try {
           
            const mediaArray = Array.isArray(mediaData) ? mediaData : [mediaData];

           
            const media = await PackageMedia.bulkCreate(mediaArray, { returning: true });
            return media;
        } catch (error) {
            console.error("Error saving package media:", error);
            throw new Error("Error saving package media: " + error.message);
        }
    }
}

module.exports = new PackageMediaRepository();