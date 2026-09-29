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
        <h1><?php echo htmlspecialchars($name); ?></h1>
        <div id="left_column">
            <p>
                <img src="<?php echo $image_filename; ?>" alt="<?php echo $image_alt; ?>">
            </p>
        </div>

        <div id="right_column">
            <p><b>List Price:</b> $<?php echo number_format($list_price, 2); ?></p>
            <p><b>Discount:</b> <?php echo $discount_percent; ?>%</p>
            <p><b>Your Price:</b> $<?php echo number_format($unit_price, 2); ?>
               (You save $<?php echo number_format($discount_amount, 2); ?>)</p>
            <form action="<?php echo '../cart' ?>" method="post">
                <input type="hidden" name="action" value="add">
                <input type="hidden" name="product_id" value="<?php echo $product['productID']; ?>">
                <b>Quantity:</b>
                <input type="text" name="newqty" value="1" size="2">
                <input type="submit" value="Add to Cart">
            </form>
        </div>
    </section>
</main>
<?php include '../view/footer.php'; ?>
