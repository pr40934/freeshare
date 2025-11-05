interface PageParams {
  video_id: string;
}

export default function Page({ params }: { params: PageParams }) {
  return <div>Video: {params.video_id}</div>;
}
 