import { LoaderProvider, useLoading, BallTriangle } from '@agney/react-loading';
import React, { Component } from "react";

function Loader() {
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
  });
  return <section {...containerProps}>{indicatorEl} Loading {indicatorEl}</section> ;
}

export default Loader;