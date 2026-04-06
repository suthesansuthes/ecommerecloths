import filterOptionsModel from '../models/filterOptionsModel.js'

// Add filter option
const addFilterOption = async (req, res) => {
    try {
        const { type, name, displayName, icon, colorCode, description } = req.body

        // Validation
        if (!type || !name) {
            return res.json({ success: false, message: 'Type and name are required' })
        }

        if (!['brand', 'color', 'material'].includes(type)) {
            return res.json({ success: false, message: 'Invalid filter type' })
        }

        // Check if already exists
        const existingOption = await filterOptionsModel.findOne({ type, name: name.toLowerCase() })
        if (existingOption) {
            return res.json({ success: false, message: 'This option already exists' })
        }

        // Get the max order for this type
        const maxOrder = await filterOptionsModel.findOne({ type }).sort({ order: -1 })
        const order = maxOrder ? maxOrder.order + 1 : 0

        const filterOption = new filterOptionsModel({
            type,
            name: name.toLowerCase(),
            displayName: displayName || name,
            icon: icon || '',
            colorCode: colorCode || '',
            description: description || '',
            order
        })

        await filterOption.save()
        res.json({ success: true, message: 'Filter option added successfully', data: filterOption })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Get all filter options
const getAllFilterOptions = async (req, res) => {
    try {
        const { type, active = true } = req.query

        let filter = {}
        if (type) filter.type = type
        if (active === 'true') filter.active = true
        else if (active === 'false') filter.active = false

        const options = await filterOptionsModel
            .find(filter)
            .sort({ order: 1, createdAt: -1 })

        res.json({ success: true, data: options })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Get options by type
const getOptionsByType = async (req, res) => {
    try {
        const { type } = req.params

        if (!['brand', 'color', 'material'].includes(type)) {
            return res.json({ success: false, message: 'Invalid filter type' })
        }

        const options = await filterOptionsModel
            .find({ type, active: true })
            .sort({ order: 1 })

        res.json({ success: true, data: options })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Update filter option
const updateFilterOption = async (req, res) => {
    try {
        const { id } = req.params
        const { displayName, icon, colorCode, description, active } = req.body

        const filterOption = await filterOptionsModel.findByIdAndUpdate(
            id,
            {
                displayName,
                icon,
                colorCode,
                description,
                active: active !== undefined ? active : true,
                updatedAt: Date.now()
            },
            { new: true }
        )

        if (!filterOption) {
            return res.json({ success: false, message: 'Filter option not found' })
        }

        res.json({ success: true, message: 'Filter option updated successfully', data: filterOption })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Delete filter option
const deleteFilterOption = async (req, res) => {
    try {
        const { id } = req.params

        const filterOption = await filterOptionsModel.findByIdAndDelete(id)

        if (!filterOption) {
            return res.json({ success: false, message: 'Filter option not found' })
        }

        res.json({ success: true, message: 'Filter option deleted successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Reorder filter options
const reorderFilterOptions = async (req, res) => {
    try {
        const { type, options } = req.body

        if (!type || !Array.isArray(options)) {
            return res.json({ success: false, message: 'Type and options array required' })
        }

        // Update order for each option
        const updatePromises = options.map((option, index) =>
            filterOptionsModel.findByIdAndUpdate(
                option._id || option.id,
                { order: index, updatedAt: Date.now() },
                { new: true }
            )
        )

        await Promise.all(updatePromises)
        res.json({ success: true, message: 'Options reordered successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Bulk operations
const bulkUpdateFilterOptions = async (req, res) => {
    try {
        const { ids, updates } = req.body

        if (!Array.isArray(ids) || !updates) {
            return res.json({ success: false, message: 'IDs array and updates object required' })
        }

        const updatePromises = ids.map(id =>
            filterOptionsModel.findByIdAndUpdate(
                id,
                { ...updates, updatedAt: Date.now() },
                { new: true }
            )
        )

        const results = await Promise.all(updatePromises)
        res.json({ success: true, message: 'Options updated successfully', data: results })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    addFilterOption,
    getAllFilterOptions,
    getOptionsByType,
    updateFilterOption,
    deleteFilterOption,
    reorderFilterOptions,
    bulkUpdateFilterOptions
}
