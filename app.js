const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Data Loaders
const DATA_DIR = path.join(__dirname, 'data');

async function getCategories() {
    const data = await fs.readFile(path.join(DATA_DIR, 'categories.json'), 'utf-8');
    return JSON.parse(data);
}

async function getAllRecipes() {
    const recipesDir = path.join(DATA_DIR, 'recipes');
    const files = await fs.readdir(recipesDir);
    const recipes = [];

    for (const file of files) {
        if (file.endsWith('.json')) {
            const data = await fs.readFile(path.join(recipesDir, file), 'utf-8');
            recipes.push(JSON.parse(data));
        }
    }
    return recipes;
}

// Routes
// 1. Home Page
app.get('/', async (req, res) => {
    try {
        const categories = await getCategories();
        res.render('home', { categories, title: "Home" });
    } catch (error) {
        res.status(500).render('error', { message: "Unable to load homepage data." });
    }
});

// 2. Category Page
app.get('/category/:slug', async (req, res) => {
    try {
        const slug = req.params.slug.toLowerCase();
        const categories = await getCategories();
        const category = categories.find(c => c.slug === slug);

        if (!category) {
            return res.status(404).render('error', { message: "Category not found. Let's get you back to the kitchen." });
        }

        const allRecipes = await getAllRecipes();
        const categoryRecipes = allRecipes.filter(r => r.category.toLowerCase() === category.name.toLowerCase());

        res.render('category', { category, recipes: categoryRecipes, title: category.name });
    } catch (error) {
        res.status(500).render('error', { message: "Unable to load category data." });
    }
});

// 3. Recipe Detail Page
app.get('/recipe/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipePath = path.join(DATA_DIR, 'recipes', `${recipeId}.json`);

        // Check if file exists to prevent server crash
        try {
            await fs.access(recipePath);
        } catch (err) {
            return res.status(404).render('error', { message: "Recipe not found. It might have been eaten!" });
        }

        const data = await fs.readFile(recipePath, 'utf-8');
        const recipe = JSON.parse(data);

        res.render('recipe', { recipe, title: recipe.title });
    } catch (error) {
        res.status(500).render('error', { message: "Unable to load recipe details." });
    }
});

app.listen(PORT, () => {
    console.log(`🍳 Recipe Book is serving on http://localhost:${PORT}`);
});