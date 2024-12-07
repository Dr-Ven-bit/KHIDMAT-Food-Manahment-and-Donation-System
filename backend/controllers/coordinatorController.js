const Coordinator=require('../models/coordinator')

const getCoordinatorProfile = async (req, res) => {
    try {

        // Fetch Coordinator details from the database
        const coordinator = await Coordinator.findById(req.user.id)
        console.log(coordinator);
        if (!coordinator) {
            return res.status(404).json({ message: 'Coordinator not found' });
        }

        res.json({
            coordinator
        });
    } catch (error) {
        console.error('Error fetching Coordinator profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports = {
    getCoordinatorProfile
}