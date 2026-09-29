<?php
require('../model/database.php');
require('../model/product_db.php');
require('../model/category_db.php');

$action = filter_input(INPUT_POST, 'action');
if ($action == NULL) {
    $action = filter_input(INPUT_GET, 'action');
    if ($action == NULL) {
        $action = 'list_products';
    }
}

switch ($action) {
    case 'list_products':
        $category_id = filter_input(INPUT_GET, 'category_id', FILTER_VALIDATE_INT);
        if ($category_id == NULL || $category_id == FALSE) {
            $category_id = 1;
        }
        $categories = get_categories();
        $category_name = get_category_name($category_id);
        $products = get_products_by_category($category_id);
        include('product_list.php');
        break;

    case 'view_product':
        $product_id = filter_input(INPUT_GET, 'product_id', FILTER_VALIDATE_INT);
        if ($product_id == NULL || $product_id == FALSE) {
            $error = 'Missing or incorrect product id.';
            include('../errors/error.php');
        } else {
            $categories = get_categories();
            $product = get_product($product_id);

            // Get product data
            $code = $product['productCode'];
            $name = $product['productName'];
            $list_price = $product['listPrice'];

            // Calculate discounts
            $discount_percent = 30;
            $discount_amount = round($list_price * ($discount_percent / 100), 2);
            $unit_price = $list_price - $discount_amount;

            // Image path
            $image_filename = '../images/' . $code . '.png';
            $image_alt = 'Image: ' . $code . '.png';

            include('product_view.php');
        }
        break;
}
?>
