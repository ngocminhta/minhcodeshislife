import Main from './Main'
import { getAllPostSummaries } from '@/lib/content'

export default async function Page() {
  const posts = getAllPostSummaries()
  return <Main posts={posts} />
}
