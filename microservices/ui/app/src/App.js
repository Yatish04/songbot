import React from 'react';
import './App.css';
import ChatBotMessage from './components/chatbotmessage';
import UserMessage from './components/usermessage';
import Grid from 'material-ui/Grid';
import Input from './components/footerinput';
import { withStyles } from 'material-ui/styles'
import Loading from './components/loading';
import { Scrollbars } from 'react-custom-scrollbars';

const styles=theme=>({
  grid1: {
    flexBasis: "90%",
    overflow: 'auto',
    //backgroundColor: 'white'
    //padding: '20px 20px 0px 0px',
    // border:"1px solid white",
  },
  grid2: {
    flexBasis: "10%",
    // border:"1px solid white",
    position: 'absolute',
    bottom: 2,
    right: 0,
    left: 0
  },
  container: {
    // minHeight: '660px',
    width: '100%',
    // minHeight: '805px',
    height: '100vh'
   //height: '660px',
   //width: '1290px',
   //border: '4px solid grey',
  },
});

class Chat extends React.Component {

  constructor(props){
      super(props)
      this.state = {
        chatHistory: [{type: 'bot' , loading: true}],
        url: '',
      }
      this.handleScroll=this.handleScroll.bind(this);
      this.handleSubmit=this.handleSubmit.bind(this);
      this.renderThumb = this.renderThumb.bind(this);
    }

  //fetching bot's greeting message
  componentDidMount() {
   fetch('https://app.cluster.hasura-app.io/input', {
      method: 'POST',
      body: JSON.stringify({
        input: 'hi'
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.json())
    .then( data => {
      let ms = data.response;
      let obj= [{ type: 'bot', message: ms, mtype: 'text', data: {},loading: false}]
      this.setState({chatHistory: obj});
    })
    .catch((error) => {
      console.log('Fetch Error :-S', error);
      let obj= [{ type: 'bot', message: 'Network Error! Try again!', mtype: 'text', data: {},loading: false}]
      this.setState({chatHistory: obj});
    });
  }

  // rendering and sending user input
  handleSubmit(e) {
    var currentHistory;
    //for updating ui
    let promise = new Promise((resolve, reject) => {
    currentHistory = this.state.chatHistory;
    var obj= { type: 'user', message: e}
    currentHistory = currentHistory.concat(obj);
    currentHistory = currentHistory.concat({type:'bot',loading: true});
    this.setState({chatHistory: currentHistory });
      resolve();
    })

    promise.then(()=> this.refs.scrollbars.scrollToBottom())
     //for sending user input
     fetch('https://app.cluster.hasura-app.io/input', {
      method: 'POST',
      body: JSON.stringify({
        input: e
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.json())
    .then(data => {
      //storing data received
      let audio,charts,watch,ms,download,obj,type='',supportingData;
        audio = {
          audiosrc:data.audiosrc,
          albumart:data.albumart,
          name: data.name
        };
        charts = data.charts;
        watch = data.watch;
        download = data.download;
        //checking which type of data received
      if(audio['audiosrc'] !== '') {
        type = 'audio';
        supportingData =audio;
      }
      else if(charts["list"] !== '') {
        type= "charts";
        supportingData =charts;
      }
      else if(download !== ""){
        type= "download";
        supportingData = download;
      }
      else if(watch !== ""){
        type= "video";
        supportingData = watch;
      }
      else {
        supportingData ="";
      }
      var url =this.state.url;
      ms = data.response;
      currentHistory.pop();
      obj= { type: 'bot', message: ms, mtype: type, data: supportingData , loading: false}
      currentHistory =currentHistory.concat(obj);
      //for changing background
      if(type === 'audio') {
        url = audio['albumart'];
        var string =`background: linear-gradient(45deg, rgba(139,136,120,0.9) 50%, rgba(0,0,0,0.9)), url(${url});
                     background-repeat: no-repeat;
                     background-position: center ;
                     background-size: cover;`
        document.body.setAttribute('style', string);
      }
      this.setState({chatHistory: currentHistory, url: url});
      this.refs.scrollbars.scrollToBottom();
    })
    .catch((error) => {
      console.log('Fetch Error :-S', error);
      //In case network error
      currentHistory.pop();
      let obj= [{ type: 'bot', message: 'Something went wrong! Try again!', mtype: 'text', data: {},loading: false}]
      currentHistory =currentHistory.concat(obj);
      this.setState({chatHistory: currentHistory});
      this.refs.scrollbars.scrollToBottom();

    });
  }

  //Scrollbar
  renderThumb({ style, ...props }) {
    const thumbStyle = {
        backgroundColor: 'grey'
    };
    return (
        <div
            style={{ ...style, ...thumbStyle }}
            {...props}/>
    );
  }

  //Sctollbar
  handleScroll(values) {
    var { top, scrollHeight } = values;
    var {url} = this.state;
    if(url === '') {
     url = 'magenta-guitar-neck630.jpg'; 
    }
    var array =[
      `background: linear-gradient(160deg, rgba(100,0,0,1) 50%, rgba(0,0,0,0.32)), url(${url});`,
      `background: linear-gradient(45deg, rgba(255,182,193,0.9) 50%, rgba(0,0,0,0.7)), url(${url});`,
      `background: linear-gradient(45deg, rgba(0,255,255,0.9) 50%, rgba(0,0,0,0.7)), url(${url});`,
      `background: linear-gradient(45deg, rgba(139,136,120,0.9) 50%, rgba(0,0,0,0.7)), url(${url});`,
    ];
    top= top*scrollHeight;
    var checkpoint = scrollHeight/4;
    if(top>=0 && top<=checkpoint)
      document.body.setAttribute("style" , array[0]);
    else if(top>=checkpoint && top<= 2*checkpoint)
      document.body.setAttribute("style" , array[1]);
    else if(top>=2*checkpoint && top<= 3*checkpoint)
      document.body.setAttribute("style" , array[2]);
    else 
      document.body.setAttribute("style" , array[3]);
  }

   //Main App Here
   render() {
    const {classes}= this.props;
    return (
     <Grid container className={classes.container} direction='column' justify='space-between'>
       <Grid item xs={12} style={{padding: '20px 0px 0px 20px'}} className={classes.grid1}>
       <Scrollbars
        ref="scrollbars"
        renderThumbHorizontal={this.renderThumb}
        renderThumbVertical={this.renderThumb}
        onScrollFrame={this.handleScroll}
       >
        {this.state.chatHistory.map((chats,index) =>
        (chats.type==='user'?
        <UserMessage key={index}  message={chats.message}/> :
        (chats.loading ? <Loading key={index}/> : <ChatBotMessage index={index} mtype={chats.mtype} data={chats.data} message={chats.message}  key={index}/>)))}
       </Scrollbars>
       </Grid>
       <Grid item xs={12}  className={classes.grid2}>
        <Input onSubmit={this.handleSubmit}/>
      </Grid>
    </Grid>);
    }
}

export default withStyles(styles)(Chat);
     



