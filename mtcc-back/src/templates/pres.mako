<%! from datetime import datetime %>

[center][size=200][color=#351C75][b]${properties.title}[/b][/color][/size]

[img]${properties.cover_big}[/img]


[img]${settings.banner_theme}/informations.png[/img]

[b]Album :[/b] ${properties.title}
[b]Genre :[/b] ${properties.genres[0].name}
[b]Artiste :[/b] ${properties.artist.name}
[b]Date Sortie :[/b] ${properties.release_date.strftime('%d/%m/%Y')}
[b]Nombres de pistes :[/b] ${properties.nb_tracks}


[img]${settings.banner_theme}/track_details.png[/img]

% for track in properties.tracks:
${track.track_position} - ${track.title} (${datetime.fromtimestamp(track.duration).strftime('%M:%S')})
% endfor


[img]${settings.banner_theme}/technical_details.png[/img]

[b]Format :[/b] Digital Media
[b]Codec audio :[/b] ${settings.codec}
% if settings.codec != 'MP3':
[b]Fréquence :[/b] ${settings.frequency}
% endif
[b]Débit Audio :[/b] ${settings.audio_bit_rate} kb/s

[img]${settings.banner_theme}/download.png[/img]

[b]Nombre de fichier(s) :[/b] ${settings.nb_files}
[b]Poids Total :[/b] [color=#ff0000]${settings.total_size} [/color]


[url=${settings.account_link}][img]${settings.banner_theme}/my_torrents.png[/img][/url]

[url=${mtcc_link}][img]${settings.banner_theme}/mtcc_pres.png[/img][/url][/center]