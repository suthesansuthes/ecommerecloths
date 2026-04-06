import express from 'express'
import {
    addFilterOption,
    getAllFilterOptions,
    getOptionsByType,
    updateFilterOption,
    deleteFilterOption,
    reorderFilterOptions,
    bulkUpdateFilterOptions
} from '../controllers/filterOptionsController.js'

const filterRouter = express.Router()

// Public routes - Get filter options
filterRouter.get('/all', getAllFilterOptions)
filterRouter.get('/type/:type', getOptionsByType)

// Admin routes - Manage filter options
filterRouter.post('/add', addFilterOption)
filterRouter.put('/update/:id', updateFilterOption)
filterRouter.delete('/delete/:id', deleteFilterOption)
filterRouter.post('/reorder', reorderFilterOptions)
filterRouter.put('/bulk-update', bulkUpdateFilterOptions)

export default filterRouter
