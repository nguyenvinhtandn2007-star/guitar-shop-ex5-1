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
        $category_name = get_category_name($category_id);
        $categories = get_categories();
        $products = get_products_by_category($category_id);
        include('product_list.php');
        break;

    case 'delete_product':
        $product_id = filter_input(INPUT_POST, 'product_id', FILTER_VALIDATE_INT);
        $category_id = filter_input(INPUT_POST, 'category_id', FILTER_VALIDATE_INT);
        if ($category_id == NULL || $category_id == FALSE || $product_id == NULL || $product_id == FALSE) {
            $error = "Missing or incorrect product id or category id.";
            include('../errors/error.php');
        } else {
            delete_product($product_id);
            header("Location: .?category_id=$category_id");
        }
        break;

    case 'show_add_form':
        $categories = get_categories();
        include('product_add.php');
        break;

    case 'add_product':
        $category_id = filter_input(INPUT_POST, 'category_id', FILTER_VALIDATE_INT);
        $code = filter_input(INPUT_POST, 'code');
        $name = filter_input(INPUT_POST, 'name');
        $price = filter_input(INPUT_POST, 'price', FILTER_VALIDATE_FLOAT);
        if ($category_id == NULL || $category_id == FALSE || $code == NULL || 
                $name == NULL || $price == NULL || $price == FALSE) {
            $error = "Invalid product data. Check all fields and try again.";
            include('../errors/error.php');
        } else {
            add_product($category_id, $code, $name, $price);
            header("Location: .?category_id=$category_id");
        }
        break;

    case 'list_categories':
        $categories = get_categories();
        include('category_list.php');
        break;

    case 'add_category':
        $name = filter_input(INPUT_POST, 'name');
        if ($name == NULL) {
            $error = "Invalid category name. Check field and try again.";
            include('../errors/error.php');
        } else {
            add_category($name);
            header('Location: .?action=list_categories');
        }
        break;

    case 'delete_category':
        $category_id = filter_input(INPUT_POST, 'category_id', FILTER_VALIDATE_INT);
        if ($category_id == NULL || $category_id == FALSE) {
            $error = "Invalid category id.";
            include('../errors/error.php');
        } else {
            delete_category($category_id);
            header('Location: .?action=list_categories');
        }
        break;
}
?>
