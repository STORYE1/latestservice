const { PackageMedia } = require("../models");

class PackageMediaRepository {
    async addMedia(mediaDataArray) {
        try {
            const mediaArray = Array.isArray(mediaDataArray) ? mediaDataArray : [mediaDataArray];
            const media = await PackageMedia.bulkCreate(mediaArray, { returning: true });
            console.log("Media Saved:", media);
            return media;
        } catch (error) {
            console.error("Error saving media:", error.message);
            throw new Error("Failed to save media");
        }
    }
}

module.exports = new PackageMediaRepository();