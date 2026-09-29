<?php include '../view/header.php'; ?>
<main>
    <aside>
        <h2>Categories</h2>
        <nav>
        <ul>
            <?php foreach ($categories as $category) : ?>
            <li>
                <a href="?category_id=<?php echo $category['categoryID']; ?>">
                    <?php echo htmlspecialchars($category['categoryName']); ?>
                </a>
            </li>
            <?php endforeach; ?>
        </ul>
        </nav>
    </aside>

    <section>
        <h1><?php echo htmlspecialchars($category_name); ?></h1>
        <ul class="nav">
            <?php foreach ($products as $product) : ?>
            <li>
                <a href="?action=view_product&amp;product_id=<?php echo $product['productID']; ?>">
                    <?php echo htmlspecialchars($product['productName']); ?>
                </a>
            </li>
            <?php endforeach; ?>
        </ul>
    </section>
</main>
<?php include '../view/footer.php'; ?>
