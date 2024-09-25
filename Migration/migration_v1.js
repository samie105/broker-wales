const UserModel = require("../mongodbConnectMigration");

// Define the migration logic
const runMigration = async () => {
  try {
    // Delete all user documents in the 'users' collection
    const deleteResult = await UserModel.deleteMany({});

    console.log("Deletion completed successfully", deleteResult);
  } catch (error) {
    console.error("Error during deletion:", error);
  }
};
runMigration();
