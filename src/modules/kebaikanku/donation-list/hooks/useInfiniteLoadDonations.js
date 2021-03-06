import { useState, useEffect } from 'react';
import { axiosInstance } from 'config/axios';

const defaultParams = {
  page: 1,
  _pageSize: 3,
  _sort: 'created_at',
  _order: 'DESC',
  _q: '',
};

export const useInfiniteLoad = (url, params = defaultParams) => {
  const [queryParams, setQueryParams] = useState(params);

  // const { data, isFetching } = getCampaignList(queryParams);
  const [dataState, setDataState] = useState({
    data: null,
    meta: null,
    isFetching: false,
    error: null,
  });

  useEffect(() => {
    const newParams = { ...defaultParams, ...params };
    setQueryParams(newParams);

    fetchFromApi(newParams, true);
  }, [params]);

  const fetchFromApi = async (queryParams, reset = false) => {
    try {
      setDataState({ ...dataState, isFetching: true });
      const { data } = await axiosInstance({
        url,
        method: 'GET',
        params: queryParams,
      });

      let meta = { ...data };
      delete meta.items;

      if (reset) {
        setDataState({
          ...dataState,
          data: [...data.items],
          meta,
          isFetching: false,
        });
      } else {
        const previousData = dataState.data ? [...dataState.data] : [];
        const newDataItems = [...data.items];

        newDataItems.map((newData) => {
          const findIndex = previousData.findIndex(
            (prev) => prev.month === newData.month
          );

          if (findIndex >= 0) {
            previousData[findIndex].donations = [
              ...previousData[findIndex].donations,
              ...newData.donations,
            ];
          } else {
            previousData.push(newData);
          }
        });

        setDataState({
          ...dataState,
          data: [...previousData],
          meta,
          isFetching: false,
        });
      }

      setQueryParams({
        ...queryParams,
        _page: queryParams._page + 1,
      });
    } catch (error) {
      if (error.response) {
        setDataState({
          ...dataState,
          isFetching: false,
          error: error.response.data,
        });
      } else if (error.request) {
        setDataState({
          ...dataState,
          isFetching: false,
          error: error.request,
        });
      } else {
        setDataState({
          ...dataState,
          isFetching: false,
          error: error.message,
        });
      }
      setDataState({ ...dataState, isFetching: false, error });
    }
  };

  const loadMore = () => {
    fetchFromApi(queryParams);
  };

  const isLoadingInitialData = !dataState.data && !dataState.error;
  // const isEmpty = dataState.data?.[0]?.length === 0;
  const isReachingEnd = dataState.meta?.page === dataState.meta?.lastPage;

  return {
    data: dataState.data,
    isFetching: dataState.isFetching,
    error: dataState.error,
    loadMore,
    isLoadingInitialData,
    isReachingEnd,
  };
};

export default useInfiniteLoad;
