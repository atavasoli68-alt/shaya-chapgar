import { blogRepository, type CreateBlogPostInput } from './blog.repository';
import { ApiError } from '@/lib/errors';

export class BlogService {
  async getPublishedPosts(params = {}) {
    return blogRepository.findPublished(params);
  }

  async getFeaturedPosts(limit = 3) {
    return blogRepository.findFeatured(limit);
  }

  async getLatestPosts(limit = 4) {
    return blogRepository.findLatest(limit);
  }

  async getPost(slug: string) {
    const post = await blogRepository.findBySlug(slug);
    if (!post || !post.isPublished) throw ApiError.notFound('مقاله');
    await blogRepository.incrementView(post.id);
    const related = await blogRepository.findRelated(post);
    return { post, related };
  }

  async getAdminPost(id: string) {
    const post = await blogRepository.findById(id);
    if (!post) throw ApiError.notFound('مقاله');
    return post;
  }

  async getAllPosts(params = {}) {
    return blogRepository.findAll(params);
  }

  async createPost(data: CreateBlogPostInput & { authorId?: string }) {
    if (!data.title || !data.content) throw ApiError.badRequest('عنوان و محتوا الزامی است');
    return blogRepository.create(data);
  }

  async updatePost(id: string, data: Partial<CreateBlogPostInput>) {
    const post = await blogRepository.findById(id);
    if (!post) throw ApiError.notFound('مقاله');
    return blogRepository.update(id, data);
  }

  async deletePost(id: string) {
    const post = await blogRepository.findById(id);
    if (!post) throw ApiError.notFound('مقاله');
    return blogRepository.delete(id);
  }

  async getCategories() {
    return blogRepository.getCategories();
  }

  async createCategory(name: string, color?: string) {
    return blogRepository.createCategory(name, color);
  }
}

export const blogService = new BlogService();
