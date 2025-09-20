'use client'
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllBlogs } from "@/redux/actions/blogActions"
import { AppDispatch, RootState } from "@/redux/store"
import BlogCard1 from "./BlogCard1"
import BlogCard2 from "./BlogCard2"
import BlogCard3 from "./BlogCard3"
import Pagination from "./Pagination"

interface BlogPostProps {
    style?: number
    showItem?: number
    showPagination?: boolean
}

export default function BlogPost({ style, showItem, showPagination }: BlogPostProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { blogs, loading } = useSelector((state: RootState) => state.blog);
    
    const [currentPage, setCurrentPage] = useState<number>(1)
    const paginationItem: number = 4

    const [pagination, setPagination] = useState<number[]>([])
    const [limit, setLimit] = useState<number>(showItem || 0)
    const [pages, setPages] = useState<number>(0)
    const [paginatedBlogs, setPaginatedBlogs] = useState<any[]>([])

    // Fetch blogs from Redux if not already loaded
    useEffect(() => {
        if (blogs.length === 0) {
            dispatch(getAllBlogs());
        }
    }, [dispatch, blogs.length]);

    // Update pagination when blogs data changes
    useEffect(() => {
        if (blogs.length > 0) {
            // Only calculate if we have blogs and a limit
            if (limit > 0) {
                createPagination();
                
                // Calculate paginated products
                const startIndex: number = currentPage * limit - limit
                const endIndex: number = startIndex + limit
                setPaginatedBlogs(blogs.slice(startIndex, endIndex));
            } else {
                // If no limit is provided, show all blogs
                setPaginatedBlogs(blogs);
            }
        }
    }, [blogs, limit, currentPage]);

    const createPagination = (): void => {
        // set pagination
        const arr: number[] = new Array(Math.ceil(blogs.length / limit))
            .fill(undefined)
            .map((_, idx) => idx + 1)

        setPagination(arr)
        setPages(Math.ceil(blogs.length / limit))
    }

    const next = (): void => {
        setCurrentPage((page) => page + 1)
    }

    const prev = (): void => {
        setCurrentPage((page) => page - 1)
    }

    const handleActive = (item: number): void => {
        setCurrentPage(item)
    }

    // Calculate pagination group for the current page
    const start: number = Math.floor((currentPage - 1) / paginationItem) * paginationItem
    const end: number = start + paginationItem
    const getPaginationGroup: number[] = pagination.slice(start, end)

    if (loading) {
        return <div>Yükleniyor...ogs...</div>
    }

    return (
        <>
            {paginatedBlogs.length === 0 && (
                <h3>No Blogs Found</h3>
            )}

            {paginatedBlogs.map(item => (
                <React.Fragment key={item.id || item._id}>
                    {!style && <BlogCard1 item={item} />}
                    {style === 1 && <BlogCard1 item={item} />}
                    {style === 2 && <BlogCard2 item={item} />}
                    {style === 3 && <BlogCard3 item={item} />}
                </React.Fragment>
            ))}

            {showPagination && pages > 1 &&
                <Pagination
                    getPaginationGroup={getPaginationGroup}
                    currentPage={currentPage}
                    pages={pages}
                    next={next}
                    prev={prev}
                    handleActive={handleActive}
                />
            }
        </>
    )
}