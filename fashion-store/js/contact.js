(() => {
  const form=document.querySelector('#contact-form'); if(!form)return;
  form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form);const message={name:data.get('name'),email:data.get('email'),topic:data.get('topic'),message:data.get('message'),createdAt:new Date().toISOString()};const inbox=Store.read('apexcare-contact-demo-v1',[]);inbox.push(message);Store.write('apexcare-contact-demo-v1',inbox);form.reset();document.querySelector('#contact-success').hidden=false;Store.toast('Message saved in this browser');});
})();
