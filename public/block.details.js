(function() {
      document.addEventListener('DOMContentLoaded', function() {
            // Header
            let ul = document.createElement('ul');
            ul.className = ['nav', 'nav-tabs', 'tabs-line'].join(' ');
            let liElements = [
                  { title: 'Blockdetails', icon: 'ti-notepad' },
                  { title: 'Eigenschaften', icon: 'ti-settings' },
                  { title: 'Änderungen', icon: 'ti-comment' }
            ];
            for (let i = 0; i < liElements.length; i++) {
                  let li = document.createElement('li');
                  li.className = 'nav-item';
                  let a = document.createElement('a');
                  a.className = 'nav-link';
                  a.href = '#tab-' + (i + 1);
                  a.setAttribute('data-toggle', 'tab');
                  let icon = document.createElement('i');
                  icon.className = liElements[i].icon;
                  let div = document.createElement('div');
                  div.innerHTML = liElements[i].title;
                  a.appendChild(icon).appendChild(div);
                  li.appendChild(a);
                  ul.appendChild(li);
            }


            // Content tabs
            let contentContainer = document.createElement('div');
            contentContainer.className = 'tab-content';
            for (let i = 0; i < liElements.length; i++) {
                  let div = document.createElement('div');
                  div.className = ['tab-pane'].join(' ');
                  div.id = 'tab-' + (i + 1);
                  contentContainer.appendChild(div);
            }

            let quickSidebarDom = document.getElementById('quick-sidebar');
            quickSidebarDom.appendChild(ul);
            quickSidebarDom.appendChild(contentContainer);

      });

}());

/*

<div class = "tab-content" >
      <div class="tab-pane chat-panel active" id="tab-1">
                <div class="chat-list">
                    <div class="slimScrollDiv" style="width: auto; height: 100%; overflow: hidden; position: relative;">
                        <div class="scroller" style="width: auto; height: 100%; overflow: hidden;">
                            <div class="media-list">
                                <a class="media" href="javascript:;" data-toggle="show-chat">
                                    <div class="media-img">
                                        <img width="40" class="img-circle" alt="image" src="./assets/img/users/u3.jpg">
                                    </div>
                                    <div class="media-body"><small class="float-right text-muted">12:05</small>
                                        <div class="media-heading">Frank Cruz</div>
                                        <div class="font-13 text-lighter">Lorem Ipsum is simply dummy.</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div class="slimScrollBar" style="background: rgb(113, 128, 143); border-radius: 7px; top: 0px; width: 4px; height: 821px; right: 1px; display: none; position: absolute; z-index: 99; opacity: 0.4;"></div>
                        <div class="slimScrollRail" style="background: rgb(51, 51, 51); border-radius: 7px; top: 0px; width: 4px; height: 100%; right: 1px; display: none; position: absolute; z-index: 90; opacity: 0.9;"></div>
                    </div>
                </div>
            </div> 
            <div class = "tab-pane" id = "tab-2" >
      <div class="slimScrollDiv" style="width: auto; height: 100%; overflow: hidden; position: relative;">
                    <div class="scroller" style="width: auto; height: 100%; overflow: hidden;">
                        <div class="font-bold mb-4 mt-2">Block SETTINGS</div>
                        <div class="settings-item">Block ölffentlich
                            <label class="ui-switch switch-icon">
                            <input type="checkbox">
                            <span></span>
                        </label>
                        </div>
                    </div>
                    <div class="slimScrollBar" style="background: rgb(113, 128, 143); border-radius: 7px; top: 0px; width: 4px; right: 1px; display: none; position: absolute; z-index: 99; opacity: 0.4;"></div>
                    <div class="slimScrollRail" style="background: rgb(51, 51, 51); border-radius: 7px; top: 0px; width: 4px; height: 100%; right: 1px; display: none; position: absolute; z-index: 90; opacity: 0.9;"></div>
                </div> </div>
      <div class = "tab-pane" id = "tab-3" >
      <div class="log-tabs">
                    <a class="active" href="javascript:;" data-toggle="tooltip" data-original-title="Alle Einträge" data-type="all"><i class="ti-view-grid"></i></a>
                    <a href="javascript:;" data-toggle="tooltip" data-original-title="Nur Hauptversionen" data-type="server"><i class="ti-harddrives"></i></a>
                    <a href="javascript:;" data-toggle="tooltip" data-original-title="Beliebteste Versionen" data-type="app"><i class="ti-pulse"></i></a>
                </div> <div class = "logs" >
      <div class="slimScrollDiv" style="width: auto; height: 100%; overflow: hidden; position: relative;">
                        <div class="scroller" style="width: auto; height: 100%; overflow: hidden;">
                            <ul class="logs-list">
                                <li class="log-item" data-type="app"><i class="ti-check log-icon text-success"></i>
                                    <div>
                                        <a>irgendwas...</a><small class="float-right text-muted">vor 1 Stunde</small></div>
                                </li>
                            </ul>
                        </div>
                        <div class="slimScrollBar" style="background: rgb(113, 128, 143); border-radius: 7px; top: 0px; width: 4px; right: 1px; display: none; position: absolute; z-index: 99; opacity: 0.4;"></div>
                        <div class="slimScrollRail" style="background: rgb(51, 51, 51); border-radius: 7px; top: 0px; width: 4px; height: 100%; right: 1px; display: none; position: absolute; z-index: 90; opacity: 0.9;"></div>
                    </div> </div> </div> </div>

*/


/*


                <div class="messenger">
                    <div class="messenger-header">
                        <a class="messenger-return" href="javascript:;">
                            <span class="ti-angle-left"></span>
                        </a>
                        <div class="text-center text-white">
                            <h6 class="mb-1 font-16">Historie</h6>
                            <div>
                                <span class="badge-point badge-danger mr-2"></span><small>Block XYZ</small></div>
                        </div>
                        <div class="dropdown">
                            <a class="messenger-more dropdown-toggle" data-toggle="dropdown">
                                <span class="ti-more-alt"></span>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item">
                                    <span class="ti-close m-r-10"></span>Historie löschen</a>
                            </div>
                        </div>
                    </div>
                    <div class="messenger-messages">
                        <div class="slimScrollDiv" style="width: auto; height: 100%; overflow: hidden; position: relative;">
                            <div class="scroller" style="width: auto; height: 100%; overflow: hidden;">
                                <div class="messenger-message">
                                    <div class="message-image">
                                        <img alt="image" src="./assets/img/users/u8.jpg">
                                    </div>
                                    <div class="message-body">Hi Jack. You are comfortable today.</div>
                                </div>
                                <div class="messenger-message messenger-message-answer">
                                    <div class="message-body">Hi Lynn. Yes Sure.</div>
                                </div>
                                <div class="messenger-message">
                                    <div class="message-image">
                                        <img alt="image" src="./assets/img/users/u8.jpg">
                                    </div>
                                    <div class="message-body">Hi. What is your main principle in work.</div>
                                </div>
                                <div class="messenger-message messenger-message-answer">
                                    <div class="message-body">Our main principle: We work hard to make our client comfortable.</div>
                                </div>
                                <div class="message-time">4.30 PM</div>
                                <div class="messenger-message">
                                    <div class="message-image">
                                        <img alt="image" src="./assets/img/users/u8.jpg">
                                    </div>
                                    <div class="message-body">
                                        <p>Here are some beautiful photos.</p>
                                        <div class="mb-3">
                                            <img alt="image" src="./assets/img/blog/culinary-1.jpeg">
                                        </div>
                                        <div>
                                            <img alt="image" src="./assets/img/blog/01.jpeg">
                                        </div>
                                    </div>
                                </div>
                                <div class="messenger-message messenger-message-answer">
                                    <div class="message-body">Thanks, they are beautiful.</div>
                                </div>
                                <div class="messenger-message">
                                    <div class="message-image">
                                        <img alt="image" src="./assets/img/users/u8.jpg">
                                    </div>
                                    <div class="message-body">How many hours are you comfortable.</div>
                                </div>
                                <div class="messenger-message messenger-message-answer">
                                    <div class="message-body">In the evening at 6.30 clock.</div>
                                </div>
                            </div>
                            <div class="slimScrollBar" style="background: rgb(113, 128, 143); border-radius: 7px; top: 0px; width: 4px; height: 597.41px; right: 1px; display: none; position: absolute; z-index: 99; opacity: 0.4;"></div>
                            <div class="slimScrollRail" style="background: rgb(51, 51, 51); border-radius: 7px; top: 0px; width: 4px; height: 100%; right: 1px; display: none; position: absolute; z-index: 90; opacity: 0.9;"></div>
                        </div>
                    </div>
                    <div class="messenger-form">
                        <div class="messenger-form-inner">
                            <input class="messenger-input" type="text" placeholder="Type a message">
                            <div class="messenger-actions">
                                <span class="messanger-button messanger-paperclip">
                                    <input type="file"><i class="la la-paperclip"></i></span>
                                <a class="messanger-button" href="javascript:;"><i class="fa fa-send-o"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                
                
                */