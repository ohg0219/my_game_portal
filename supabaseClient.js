// supabaseClient.js

const supabaseUrl = 'https://pswlxepdmdelebfxbneh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzd2x4ZXBkbWRlbGViZnhibmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NjYwNjIsImV4cCI6MjA3MzE0MjA2Mn0.wpjWBbA9-NoH-9BA6yYE44Esvs0QUcI_xBhIBk5PcK0';

// supabase-js CDN이 로드한 전역 supabase 객체의 createClient 함수를 사용하여 클라이언트를 생성합니다.
// 생성된 클라이언트 인스턴스를 window.supabase에 할당하여 다른 스크립트에서 사용할 수 있도록 합니다.
// 이렇게 하면 원래의 전역 supabase 객체를 클라이언트 인스턴스로 덮어쓰게 됩니다.
window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
