import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getAllPosts } from '../data/posts';
import { BlogPost as BlogPostType } from '../types/blog';
import { ArrowLeft, Calendar, User, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import RelatedBlogPosts from './RelatedBlogPosts';
import siteConfig from '../config/site';
import ShareButtons from './ShareButtons';
import SearchBar from './SearchBar';

// YouTube URL patterns
const YOUTUBE_REGEX = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [readingTime, setReadingTime] = useState<number>(0);

  useEffect(() => {
    if (!slug) return;
    
    getAllPosts().then((posts) => {
      const foundPost = posts.find(p => p.slug === slug);
      setPost(foundPost || null);
      
      if (foundPost) {
        // Set featured image directly from the post object
        setFeaturedImage(foundPost.featuredImage || null);
        
        // Calculate reading time
        const wordsPerMinute = 225;
        const textLength = foundPost.content.split(/\s+/).length;
        const time = Math.ceil(textLength / wordsPerMinute);
        setReadingTime(time < 1 ? 1 : time);
      }
      
      setLoading(false);
      
      if (!foundPost) {
        navigate('/blog', { replace: true });
      }
    }).catch((err) => {
      console.error('Error loading blog post:', err);
      setError('Unable to load blog post');
      setLoading(false);
    });
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <Helmet>
          <title>Error - {siteConfig.title}</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <Helmet>
          <title>Post Not Found - {siteConfig.title}</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
          Blog post not found. <Link to="/blog" className="underline">Return to blog list</Link>
        </div>
      </div>
    );
  }

  // Check if this is a YouTube thumbnail
  const isYoutubeThumb = post.featuredImage?.includes('img.youtube.com');

  // Remove the title from the content to avoid duplication
  const contentWithoutTitle = post.content.replace(/^#\s+.*$/m, '').trim();

  // Create a concise description from the excerpt or post content
  const description = post.excerpt || 
    contentWithoutTitle
      .replace(/[#*_`[\]()]/g, '')
      .substring(0, 160)
      .trim() + '...';

  const canonical = `${siteConfig.siteUrl}/${post.slug}`;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Helmet>
        <title>{post.title} - {siteConfig.title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        {featuredImage && <meta property="og:image" content={featuredImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={description} />
        {featuredImage && <meta name="twitter:image" content={featuredImage} />}
        <link rel="canonical" href={canonical} />
        {post.author && <meta name="author" content={post.author} />}
        <meta property="article:published_time" content={post.date} />
      </Helmet>
      
      <div className="flex justify-between items-center mb-8">
        <Link 
          to="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
        
        <SearchBar compact={true} />
      </div>
      
      {/* Featured Image */}
      <div 
        className={`w-full ${isYoutubeThumb ? 'youtube-featured' : 'h-64 md:h-96'} bg-cover bg-center rounded-lg mb-8 relative`}
        style={{ 
          backgroundImage: featuredImage 
            ? `url(${featuredImage})` 
            : 'url(https://images.unsplash.com/photo-1487611459768-bd414656ea10?q=80&w=1920&auto=format&fit=crop)'
        }}
      >
        {/* Only add overlay for non-YouTube, non-featured images */}
        {!featuredImage && !isYoutubeThumb && (
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Only show title overlay for non-featured images that aren't YouTube thumbnails */}
          {!featuredImage && !isYoutubeThumb && (
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4">
              {post.title}
            </h1>
          )}
        </div>
      </div>
      
      <article className="bg-white rounded-lg shadow-sm p-8">
        {/* If we have a featured image or YouTube thumbnail, show the title in the content */}
        {(featuredImage || isYoutubeThumb) && (
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
        )}
        
        <header className="mb-8 flex flex-wrap justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center text-gray-600 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-600">{readingTime} min read</span>
            </div>
            {post.author && (
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>{post.author}</span>
              </div>
            )}
          </div>
          
          {/* Social sharing buttons */}
          <ShareButtons 
            url={canonical}
            title={post.title}
            description={description}
            className="mb-4 md:mb-0"
          />
        </header>
        
        <div className="prose prose-lg prose-slate max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => {
                if (!props.src) return null;
                
                // Handle image links - ensure they use the original URL
                const imgSrc = props.src;
                
                return (
                  <div className="my-8">
                    <img
                      {...props}
                      src={imgSrc}
                      className="rounded-lg shadow-md w-full h-auto"
                      alt={props.alt || 'Blog post image'}
                      loading="lazy"
                      onError={(e) => {
                        console.error('Image failed to load:', imgSrc);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                );
              },
              a: ({ node, children, ...props }) => {
                // Check if this is a YouTube link
                const youtubeMatch = props.href ? props.href.match(YOUTUBE_REGEX) : null;
                
                if (youtubeMatch && youtubeMatch[1]) {
                  const videoId = youtubeMatch[1];
                  return (
                    <div className="my-8 aspect-w-16 aspect-h-9">
                      <iframe
                        width="100%"
                        height="400"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg shadow-md"
                      ></iframe>
                    </div>
                  );
                }
                
                // Check if this is an image URL that should be rendered as an image
                if (props.href && /\.(jpg|jpeg|png|gif|webp)$/i.test(props.href)) {
                  const content = children?.toString() || '';
                  // If the link text is the same as the URL or seems to be a description rather than a link text
                  if (content === props.href || content === 'Image' || content === 'image' || content.length < 10) {
                    return (
                      <div className="my-8">
                        <img
                          src={props.href}
                          className="rounded-lg shadow-md w-full h-auto"
                          alt={content !== props.href ? content : 'Blog post image'}
                          loading="lazy"
                          onError={(e) => {
                            console.error('Image failed to load:', props.href);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    );
                  }
                }
                
                // Regular link
                return (
                  <a 
                    {...props} 
                    className="text-blue-600 hover:text-blue-800 underline"
                    target={props.href?.startsWith('http') ? '_blank' : undefined}
                    rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {children}
                  </a>
                );
              },
              p: ({ node, children, ...props }) => {
                // Special handling for paragraphs containing potential YouTube embeds
                if (
                  React.Children.count(children) === 1 &&
                  typeof children === 'string'
                ) {
                  const text = children.toString();
                  
                  // Check if it's an image URL
                  if (/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(text)) {
                    return (
                      <div className="my-8">
                        <img
                          src={text}
                          className="rounded-lg shadow-md w-full h-auto"
                          alt="Blog post image"
                          loading="lazy"
                          onError={(e) => {
                            console.error('Image failed to load:', text);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    );
                  }
                  
                  // Check for youtube: embeds - this is our custom format
                  if (text.trim().startsWith('youtube:')) {
                    const videoId = text.trim().replace(/^youtube:/, '');
                    
                    return (
                      <div className="my-8 aspect-w-16 aspect-h-9">
                        <iframe
                          width="100%"
                          height="400"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded-lg shadow-md"
                        ></iframe>
                      </div>
                    );
                  }
                }
                
                return <p {...props} className="text-gray-700 leading-relaxed mb-6">{children}</p>;
              },
              h2: ({ node, ...props }) => (
                <h2 {...props} className="text-3xl font-semibold mt-12 mb-6" />
              ),
              h3: ({ node, ...props }) => (
                <h3 {...props} className="text-2xl font-semibold mt-8 mb-4" />
              ),
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc pl-6 mb-6" />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal pl-6 mb-6" />
              ),
              li: ({ node, ...props }) => (
                <li {...props} className="mb-2" />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote {...props} className="border-l-4 border-gray-200 pl-4 italic my-6" />
              ),
              code: ({ node, inline, ...props }) => (
                inline 
                  ? <code {...props} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" />
                  : <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
                      <code {...props} className="font-mono text-sm" />
                    </pre>
              ),
            }}
          >
            {contentWithoutTitle}
          </ReactMarkdown>
        </div>
        
        {/* Social sharing at the end of the article */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-gray-700 font-medium mb-4 sm:mb-0">Share this article:</p>
            <ShareButtons 
              url={canonical}
              title={post.title}
              description={description}
            />
          </div>
        </div>
      </article>
      
      {/* Related Posts Section */}
      <RelatedBlogPosts currentPostSlug={post.slug} />
    </div>
  );
};

export default BlogPost;