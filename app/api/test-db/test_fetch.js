async function test() {
  try {
    const res = await fetch('https://74mncgr7.us-east.insforge.app');
    console.log('Status:', res.status);
    console.log('Text:', await res.text());
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
test();
