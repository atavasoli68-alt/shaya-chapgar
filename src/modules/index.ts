/**
 * ─── Module Exports ────────────────────────────────────────────────
 * همه ماژول‌ها از یک جا export می‌شن.
 *
 * به جای:
 *   import { productService } from '@/modules/products/product.service';
 *
 * می‌تونی بنویسی:
 *   import { productService } from '@/modules';
 */

export { productRepository, ProductRepository } from './products/product.repository';
export { productService, ProductService } from './products/product.service';
export { orderRepository, OrderRepository } from './orders/order.repository';
export { userRepository, userService, UserRepository, UserService } from './users/user.repository';
