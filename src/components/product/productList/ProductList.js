import React, { useEffect, useState } from 'react';
import "./productList.css";
import { SpinerImg } from '../../loader/Loader';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {AiOutlineEye} from "react-icons/ai";
import Search from '../../search/Search';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER_PRODUCTS, selectFilteredProduct } from '../../../redux/features/product/filterSlice';
import ReactPaginate from 'react-paginate';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { deleteProduct, getProducts } from '../../../redux/features/product/productSlice';
import { Link } from 'react-router-dom';



const ProductList = ({products, isLoading}) => {
const [search, setSearch] = useState("");
const filteredProducts = useSelector(selectFilteredProduct);
const dispatch = useDispatch()

    const shortenText = (text, n) => {
            if(text.length > n){
                const shortenedText = text.substring(0, n).concat("...")
                return shortenedText;
            }
            return text;
    }

    const delProduct = async (id) => {
        await dispatch(deleteProduct(id));
        await dispatch(getProducts());
        
    }
    const confirmDelete = (id) => {
        confirmAlert({
            title: 'Delete Product',
            message: 'Are you sure you want to delete product?',
            buttons: [
              {
                label: 'Delete',
                onClick: () => delProduct(id)
              },
              {
                label: 'Cancel',
             //   onClick: () => alert('Click No')
              }
            ]
          });
    }
    //Begin pagination
    const [currentItmes, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);

    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 4;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;

        setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));

    }, [itemOffset, itemsPerPage, filteredProducts]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage)
         % filteredProducts.length;
         setItemOffset(newOffset);
    }
    
    //End Pagination

    useEffect(() => {
        dispatch(FILTER_PRODUCTS({products, search}))
    }, [products, search, dispatch]);
  return (
    <div className='product-list'>
     <hr />
     <div className='table'>
         <div className='--flex-between --flex-dir-column'>
               <span >
                   <h3>Inventory Item</h3>
               </span>
               <span>
                   <Search value={search} onChange={(e) => setSearch(e.target.value)} />
               </span>
         </div>

         {isLoading && <SpinerImg />}
         <div className='table'>
            {!isLoading && products.length === 0 ? (
                <p>No product found, please add a product </p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Value</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentItmes.map((product, index) => {
                                const {_id, name, category, price, quantity} = product
                                return (
                                <tr key={_id}>
                                    <td>{index + 1}</td>
                                    <td>{
                                    shortenText(name, 16)}</td>
                                    <td>{category}</td>
                                    <td>{`$${price}`}</td>
                                    <td>{quantity}</td>
                                    <td>{`$${price * quantity}`}</td>
                                    <td className='icons'>
                                        <Link to={`/product-detail/${_id}`}>
                                        <span>
                                            <AiOutlineEye size={25} color={"purple"}/>
                                        </span>
                                        </Link>
                                        <Link to={`/edit-product/${_id}`}>
                                        <span>
                                            <FaEdit size={20} color={"green"} />
                                        </span>
                                        </Link>
                                        <span>
                                            <FaTrashAlt onClick={() => confirmDelete(_id)} size={20} color={"red"} />
                                        </span>
                                    </td>
                                </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            )}    
         </div>
         <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={4}
        pageCount={pageCount}
        previousLabel="<Prev"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName='page-num'
        previousLinkClassName='page-num'
        nextLinkClassName='page-num'
        activeLinkClassName='activePage'
      />

     </div>
    </div>
  )
}

export default ProductList
